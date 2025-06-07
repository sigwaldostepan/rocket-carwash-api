"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
            .take(limit)
            .skip(offset);
        if (dateFrom) {
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
        const [transactions, total] = await query.getManyAndCount();
        return {
            transactions,
            total,
        };
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
                complimentAmount > subtotal ? (subtotal -= subtotal) : (subtotal -= complimentAmount);
            }
            return subtotal;
        }, 0);
        return transTotal;
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
        const additionalPointTransation = !isRedeemPoints;
        if (additionalPointTransation && customer) {
            customer.point += transaction_constant_1.POINT_REWARD;
        }
        const itemMap = new Map(items.map((item) => [item.id, item]));
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