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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionDetail = void 0;
const item_entity_1 = require("../../item/entities/item.entity");
const typeorm_1 = require("typeorm");
const transaction_entity_1 = require("./transaction.entity");
let TransactionDetail = class TransactionDetail {
};
exports.TransactionDetail = TransactionDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TransactionDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => transaction_entity_1.Transaction, (transaction) => transaction.details, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    __metadata("design:type", transaction_entity_1.Transaction)
], TransactionDetail.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => item_entity_1.Item, (item) => item.transactionDetail, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", item_entity_1.Item)
], TransactionDetail.prototype, "item", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], TransactionDetail.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], TransactionDetail.prototype, "redeemedQuantity", void 0);
exports.TransactionDetail = TransactionDetail = __decorate([
    (0, typeorm_1.Entity)()
], TransactionDetail);
//# sourceMappingURL=transaction-detail.entity.js.map