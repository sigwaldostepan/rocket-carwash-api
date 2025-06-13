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
exports.ExpenseController = void 0;
const common_1 = require("@nestjs/common");
const expense_service_1 = require("./expense.service");
const dto_1 = require("./dto");
const helpers_1 = require("../../common/helpers");
const update_expense_category_dto_1 = require("./dto/update-expense-category.dto");
const find_expenses_dto_1 = require("./dto/find-expenses.dto");
let ExpenseController = class ExpenseController {
    constructor(expenseService) {
        this.expenseService = expenseService;
    }
    async findAll(findExpensesDto) {
        const { page, limit } = findExpensesDto;
        const { expenses, count } = await this.expenseService.findAll(findExpensesDto);
        return (0, helpers_1.paginateResponse)(expenses, page, limit, count);
    }
    async create(createCategoryDto) {
        return await this.expenseService.create(createCategoryDto);
    }
    async delete(id) {
        return await this.expenseService.delete(id);
    }
    async createCategory(createExpenseCategoryDto) {
        return await this.expenseService.createCategory(createExpenseCategoryDto);
    }
    async updateCategory(id, updateExpenseCategoryDto) {
        return await this.updateCategory(id, updateExpenseCategoryDto);
    }
    findAllCategories() {
        const categories = this.expenseService.findAllCategories();
        return categories;
    }
    findCategory(id) {
        const categories = this.expenseService.findCategory(id);
        return categories;
    }
};
exports.ExpenseController = ExpenseController;
__decorate([
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_expenses_dto_1.FindExpensesDto]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateExpenseDto]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('/categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateExpenseCategoryDto]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_expense_category_dto_1.UpdateExpenseCategoryDto]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Get)('/categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "findAllCategories", null);
__decorate([
    (0, common_1.Get)('/categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "findCategory", null);
exports.ExpenseController = ExpenseController = __decorate([
    (0, common_1.Controller)('expenses'),
    __metadata("design:paramtypes", [expense_service_1.ExpenseService])
], ExpenseController);
//# sourceMappingURL=expense.controller.js.map