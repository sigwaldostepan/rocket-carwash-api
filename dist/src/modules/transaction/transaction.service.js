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
let TransactionService = class TransactionService {
    constructor(custService, transRepo, transDetailRepo, itemRepo, custRepo) {
        this.custService = custService;
        this.transRepo = transRepo;
        this.transDetailRepo = transDetailRepo;
        this.itemRepo = itemRepo;
        this.custRepo = custRepo;
    }
    async findTransactions(paginationDto) {
        const [transactions, total] = await this.transRepo
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.details', 'details')
            .leftJoinAndSelect('details.item', 'item')
            .orderBy('transaction.invoiceNo', 'ASC')
            .take(paginationDto.limit)
            .skip(paginationDto.offset)
            .getManyAndCount();
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
    async createTransaction(createTransactionDto) {
        const customer = await this.custService.findCustomerById(createTransactionDto.customerId);
        const items = await this.itemRepo.find({
            where: {
                id: (0, typeorm_2.In)(createTransactionDto.items),
            },
        });
        const foundItemIds = items.map((item) => item.id);
        const notFoundItems = createTransactionDto.items.filter((id) => !foundItemIds.includes(id));
        if (notFoundItems.length > 0) {
            throw new common_1.NotFoundException(`Item dgn id ${notFoundItems.join(', ')} gak ketemu`);
        }
        const isRedeemPoints = createTransactionDto.redeemedItems.length > 0;
        const totalRedeemedItems = createTransactionDto.redeemedItems.length;
        if (isRedeemPoints) {
            const requiredPoint = transaction_constant_1.REDEEM_POINT_COST * totalRedeemedItems;
            if (customer.point < requiredPoint) {
                throw new common_1.BadRequestException('Point customer gak cukup');
            }
            customer.point -= requiredPoint;
        }
        const canEarnPoint = !isRedeemPoints;
        if (canEarnPoint) {
            customer.point += transaction_constant_1.POINT_REWARD;
        }
        const transactionDetail = items.map((item) => {
            const isRedeemed = isRedeemPoints ? createTransactionDto.redeemedItems.includes(item.id) : false;
            return this.transDetailRepo.create({
                item,
                isRedeemed: isRedeemed,
            });
        });
        const invoiceNo = await this.generateInvoiceNo();
        await this.custRepo.update(customer.id, { point: customer.point });
        const transaction = this.transRepo.create({
            invoiceNo,
            customer,
            transTotal: this.calculateTransTotal(transactionDetail, createTransactionDto.isCompliment),
            isCompliment: createTransactionDto.isCompliment,
            paymentMethod: createTransactionDto.paymentMethod,
            details: transactionDetail,
        });
        await this.transRepo.save(transaction);
        return {
            ...transaction,
            details: transactionDetail,
        };
    }
    async deleteTransaction(id) {
        const transaction = await this.findTransactionById(id);
        return await this.transRepo.delete(transaction.id);
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
    calculateTransTotal(detail, isCompliment) {
        if (isCompliment) {
            return 0;
        }
        const transTotal = detail.reduce((total, detail) => {
            return Number(total) + (detail.isRedeemed ? 0 : Number(detail.item.price));
        }, 0);
        return transTotal;
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