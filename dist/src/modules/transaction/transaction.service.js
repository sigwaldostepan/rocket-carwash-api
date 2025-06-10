"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const typeorm_2 = require("typeorm");
const item_entity_1 = require("../item/entities/item.entity");
const customer_service_1 = require("../customer/customer.service");
const customer_entity_1 = require("../customer/entities/customer.entity");
const transaction_constant_1 = require("./transaction.constant");
const date_fns_1 = require("date-fns");
const ExcelJS = __importStar(require("exceljs"));
let TransactionService = class TransactionService {
    constructor(custService, transRepo, transDetailRepo, itemRepo, custRepo) {
        this.custService = custService;
        this.transRepo = transRepo;
        this.transDetailRepo = transDetailRepo;
        this.itemRepo = itemRepo;
        this.custRepo = custRepo;
    }
    async findTransactions(findTransactionDto) {
        const { limit, offset, dateFrom, range } = findTransactionDto;
        const query = this.transRepo
            .createQueryBuilder('transaction')
            .orderBy('transaction.invoiceNo', 'ASC')
            .leftJoinAndSelect('transaction.customer', 'customer')
            .leftJoinAndSelect('transaction.details', 'details')
            .leftJoinAndSelect('details.item', 'item')
            .take(limit)
            .skip(offset);
        this.assignDateFilter(dateFrom, range, query);
        const [transactions, total] = await query.getManyAndCount();
        return {
            transactions,
            total,
        };
    }
    async getTransactionSummary(findTransactionDto) {
        const [transactionCount, transactionTotalAmount, paymentMethodSummary] = await Promise.all([
            this.getTransactionCount(findTransactionDto),
            this.getTransactionTotalAmount(findTransactionDto),
            this.getPaymentMethodSummary(findTransactionDto),
        ]);
        const updatedPaymentMethodSummary = paymentMethodSummary.map((summary) => ({
            ...summary,
            percentage: transactionTotalAmount > 0 ? ((+summary.totalAmount / transactionTotalAmount) * 100).toFixed(2) : 0,
        }));
        return {
            transactionCount,
            transactionTotalAmount,
            paymentMethodSummary: updatedPaymentMethodSummary,
        };
    }
    async exportTransactionsExcel(exportTransactionExcelDto) {
        const { transactions } = await this.findTransactions(exportTransactionExcelDto);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Transaksi');
        worksheet.columns = [
            { header: 'Invoice No', key: 'invoiceNo' },
            { header: 'Customer', key: 'customer' },
            { header: 'Payment Method', key: 'paymentMethod' },
            { header: 'Tanggal', key: 'createdAt' },
            { header: 'Item', key: 'item' },
            { header: 'Subtotal', key: 'subtotal' },
            { header: 'Diskon', key: 'discount' },
            { header: 'Total', key: 'transTotal' },
        ];
        worksheet.addRows(transactions.map((transaction) => {
            const subtotal = transaction.details.reduce((total, detail) => total + detail.item.price * detail.quantity, 0);
            const discount = transaction.details.reduce((total, detail) => {
                const redeemedAmount = +detail.redeemedQuantity * +detail.item.price || 0;
                const { complimentValue } = transaction;
                return total + redeemedAmount + +complimentValue;
            }, 0);
            return {
                invoiceNo: transaction.invoiceNo,
                customer: transaction.customer?.name || '-',
                paymentMethod: transaction.paymentMethod,
                createdAt: transaction.createdAt,
                item: transaction.details.map((detail) => detail.item.name).join(', '),
                subtotal,
                discount,
                transTotal: transaction.transTotal,
            };
        }));
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }
    async findTransactionById(id) {
        const transaction = await this.transRepo.findOne({
            where: {
                id,
            },
            relations: ['details', 'details.item'],
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaksi gak ketemu');
        }
        return transaction;
    }
    async createTransaction(createTransactionDto) {
        let customer = null;
        if (createTransactionDto.customerId) {
            customer = await this.custService.findCustomerById(createTransactionDto.customerId);
        }
        const dtoItemsId = createTransactionDto.items.map((dtoItem) => dtoItem.itemId);
        const items = await this.itemRepo.find({
            where: {
                id: (0, typeorm_2.In)(dtoItemsId),
            },
        });
        const foundItemIds = items.map((item) => item.id);
        const notFoundItems = createTransactionDto.items.filter((dtoItem) => !foundItemIds.includes(dtoItem.itemId));
        if (notFoundItems.length > 0) {
            throw new common_1.NotFoundException(`Item dgn id ${notFoundItems.join(', ')} gak ketemu`);
        }
        const totalRedeemedItems = createTransactionDto.items.reduce((total, item) => total + (item.redeemedQuantity ?? 0), 0);
        const isRedeemPoints = totalRedeemedItems > 0;
        if (!customer && isRedeemPoints) {
            throw new common_1.UnprocessableEntityException('Transaksi tanpa customer, tidak bisa redeem point');
        }
        if (isRedeemPoints && customer) {
            const requiredPoint = transaction_constant_1.REDEEM_POINT_COST * totalRedeemedItems;
            if (customer.point < requiredPoint) {
                throw new common_1.BadRequestException('Point customer gak cukup');
            }
            customer.point -= requiredPoint;
        }
        const addPointTransaction = items.some((item) => !!item.isGetPoint);
        const itemMap = new Map(items.map((item) => [item.id, item]));
        if (addPointTransaction && customer) {
            const pointsToAdd = createTransactionDto.items.reduce((total, dtoItem) => {
                const item = itemMap.get(dtoItem.itemId);
                if (item.isGetPoint) {
                    const notRedeemedQuantity = dtoItem.quantity - (dtoItem.redeemedQuantity ?? 0);
                    return (total += transaction_constant_1.POINT_REWARD * notRedeemedQuantity);
                }
                return total;
            }, 0);
            customer.point += pointsToAdd;
        }
        const transactionDetail = createTransactionDto.items.map((dtoItem) => {
            const isRedeemed = dtoItem.redeemedQuantity > 0;
            const matchedItem = itemMap.get(dtoItem.itemId);
            if (!matchedItem) {
                throw new common_1.NotFoundException(`Item ${matchedItem.name} gak ketemu`);
            }
            if (!matchedItem.isRedeemable && isRedeemed) {
                throw new common_1.UnprocessableEntityException(`Item ${matchedItem.name} gak bisa diredeem`);
            }
            const entity = this.transDetailRepo.create({
                item: matchedItem,
                quantity: dtoItem.quantity,
                redeemedQuantity: dtoItem.redeemedQuantity ?? 0,
            });
            return entity;
        });
        const invoiceNo = await this.generateInvoiceNo();
        if (customer) {
            await this.custRepo.update(customer.id, { point: customer.point });
        }
        const transaction = this.transRepo.create({
            invoiceNo,
            customer,
            transTotal: this.calculateTransTotal(transactionDetail, createTransactionDto.isCompliment, createTransactionDto.complimentAmount),
            isCompliment: createTransactionDto.isCompliment,
            paymentMethod: createTransactionDto.paymentMethod,
            details: transactionDetail,
            complimentValue: createTransactionDto.complimentAmount ?? 0,
        });
        await this.transRepo.save(transaction);
        return {
            ...transaction,
            details: transactionDetail,
        };
    }
    async deleteTransaction(id) {
        const transaction = await this.findTransactionById(id);
        return await this.transRepo.remove(transaction);
    }
    assignDateFilter(dateFrom, range, query) {
        if (!dateFrom) {
            return;
        }
        let from = null;
        let to = null;
        if (range === 'daily' || !range) {
            from = (0, date_fns_1.startOfDay)(dateFrom);
            to = (0, date_fns_1.endOfDay)(dateFrom);
        }
        else if (range === 'weekly') {
            from = (0, date_fns_1.startOfWeek)(dateFrom);
            to = (0, date_fns_1.endOfWeek)(dateFrom);
        }
        else if (range === 'monthly') {
            from = (0, date_fns_1.startOfMonth)(dateFrom);
            to = (0, date_fns_1.endOfMonth)(dateFrom);
        }
        else if (range === 'yearly') {
            from = (0, date_fns_1.startOfYear)(dateFrom);
            to = (0, date_fns_1.endOfYear)(dateFrom);
        }
        else if (range === 'toToday') {
            from = (0, date_fns_1.startOfDay)(dateFrom);
            to = (0, date_fns_1.endOfDay)(new Date());
        }
        else {
            throw new common_1.UnprocessableEntityException('Tipe range gak valid');
        }
        query.where('transaction.createdAt BETWEEN :from AND :to', { from, to });
    }
    async getTransactionCount(findTransactionDto) {
        const { dateFrom, range } = findTransactionDto;
        const query = this.transRepo.createQueryBuilder('transaction').select('COUNT(*)', 'transactionCount');
        this.assignDateFilter(dateFrom, range, query);
        const { transactionCount } = await query.getRawOne();
        return +transactionCount;
    }
    async getTransactionTotalAmount(findTransactionDto) {
        const { dateFrom, range } = findTransactionDto;
        const query = this.transRepo
            .createQueryBuilder('transaction')
            .select('SUM(transaction.transTotal)', 'sumTransTotal');
        this.assignDateFilter(dateFrom, range, query);
        const { sumTransTotal } = await query.getRawOne();
        return +sumTransTotal;
    }
    async getPaymentMethodSummary(findTransactionDto) {
        const { dateFrom, range } = findTransactionDto;
        const query = this.transRepo
            .createQueryBuilder('transaction')
            .select('transaction.paymentMethod', 'paymentMethod')
            .addSelect('COUNT(transaction.id)', 'count')
            .addSelect('SUM(transaction.transTotal)', 'totalAmount')
            .addGroupBy('transaction.paymentMethod');
        this.assignDateFilter(dateFrom, range, query);
        const result = await query.getRawMany();
        return result;
    }
    calculateTransTotal(detail, isCompliment, complimentAmount) {
        const transTotal = detail.reduce((total, detail) => {
            const { item, quantity, redeemedQuantity } = detail;
            if (redeemedQuantity > quantity) {
                throw new common_1.UnprocessableEntityException('Jumlah diredeem gak lebih banyak dari jumlah itemnya yg diorder dong');
            }
            let subtotal = 0;
            if (redeemedQuantity > 0) {
                const unredeemedValue = quantity * item.price - redeemedQuantity * item.price;
                subtotal = Number(total) + unredeemedValue;
                return subtotal;
            }
            subtotal = Number(total) + item.price * quantity;
            if (isCompliment) {
                if (complimentAmount > subtotal) {
                    subtotal = 0;
                }
                else {
                    subtotal -= complimentAmount;
                }
            }
            return subtotal;
        }, 0);
        return transTotal;
    }
    async generateInvoiceNo() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear() % 100).padStart(2, '0');
        const utcFrom = new Date(Date.UTC(now.getFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
        const utcTo = new Date(Date.UTC(now.getFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));
        const countToday = await this.transRepo.count({
            where: {
                createdAt: (0, typeorm_2.Between)(utcFrom, utcTo),
            },
        });
        const formattedDate = `${year}${month}${day}`;
        const invoiceNo = `RO-${formattedDate}-${String(countToday + 1).padStart(4, '0')}`;
        return invoiceNo;
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Transaction)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.TransactionDetail)),
    __param(3, (0, typeorm_1.InjectRepository)(item_entity_1.Item)),
    __param(4, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [customer_service_1.CustomerService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map