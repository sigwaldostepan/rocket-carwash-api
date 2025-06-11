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
exports.CreateTransactionDto = exports.TransactionItemDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class TransactionItemDto {
}
exports.TransactionItemDto = TransactionItemDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'ID item gk boleh kosong' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransactionItemDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.Min)(0, { message: 'Quantity gk boleh negatif' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TransactionItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0, { message: 'Jumlah item yg diredeem gk boleh negatif' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TransactionItemDto.prototype, "redeemedQuantity", void 0);
class CreateTransactionDto {
}
exports.CreateTransactionDto = CreateTransactionDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TransactionItemDto),
    __metadata("design:type", Array)
], CreateTransactionDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Metode pembayaran gk boleh kosong' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTransactionDto.prototype, "isCompliment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0, { message: 'Nilai komplimen gak boleh negatif' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "complimentAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTransactionDto.prototype, "isNightShift", void 0);
//# sourceMappingURL=create-transaction.dto.js.map