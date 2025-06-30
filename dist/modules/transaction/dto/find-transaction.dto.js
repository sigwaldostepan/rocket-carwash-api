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
exports.FindTransactionDto = void 0;
const class_validator_1 = require("class-validator");
const dto_1 = require("../../../common/dto");
class FindTransactionDto extends dto_1.PaginationDto {
}
exports.FindTransactionDto = FindTransactionDto;
__decorate([
    (0, class_validator_1.MaxLength)(10, { message: 'Tipe data tanggal gk valid' }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Tipe tanggal gak valid',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindTransactionDto.prototype, "dateFrom", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['daily', 'weekly', 'monthly', 'yearly', 'toToday'], { message: 'Range gak valid' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindTransactionDto.prototype, "range", void 0);
//# sourceMappingURL=find-transaction.dto.js.map