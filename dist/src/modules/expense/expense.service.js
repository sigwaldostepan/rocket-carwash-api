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
exports.ExpenseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const expense_category_entity_1 = require("./entities/expense-category.entity");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
const date_fns_1 = require("date-fns");
const ExcelJS = __importStar(require("exceljs"));
let ExpenseService = class ExpenseService {
    constructor(expenseCategoryRepo, expenseRepo) {
        this.expenseCategoryRepo = expenseCategoryRepo;
        this.expenseRepo = expenseRepo;
    }
    async findAll({ description, limit, offset, range = 'toToday', dateFrom }) {
        const query = this.expenseRepo
            .createQueryBuilder('expense')
            .leftJoinAndSelect('expense.category', 'category')
            .orderBy('expense.createdAt', 'ASC')
            .take(limit)
            .skip(offset);
        this.assignDateFilter(dateFrom, range, query);
        if (description) {
            query.andWhere('expense.description ILIKE :description', { description: `%${description}%` });
        }
        const [expenses, count] = await query.getManyAndCount();
        return { expenses, count };
    }
    async find(id) {
        const expense = await this.expenseRepo.findOne({ where: { id }, relations: ['category'] });
        if (!expense) {
            throw new common_1.NotFoundException('Transaksi pengeluaran gak ketemu');
        }
        return expense;
    }
    async getSummary({ dateFrom, range, description }) {
        const query = this.expenseRepo
            .createQueryBuilder('expense')
            .select('SUM(expense.amount)', 'totalAmount')
            .addSelect('COUNT(expense.id)', 'totalCount')
            .leftJoin('expense.category', 'category');
        this.assignDateFilter(dateFrom, range, query);
        if (description) {
            query.andWhere('expense.description ILIKE :description', { description: `%${description}%` });
        }
        const result = await query.getRawOne();
        return {
            totalAmount: parseFloat(result.totalAmount) || 0,
            totalCount: parseInt(result.totalCount, 10) || 0,
        };
    }
    async exportExcel(findExpensesDto) {
        const { expenses } = await this.findAll(findExpensesDto);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Transaksi');
        worksheet.columns = [
            { header: 'Kategori', key: 'category', width: 20 },
            { header: 'Deskripsi', key: 'description', width: 50 },
            { header: 'Jumlah', key: 'amount', width: 15 },
            { header: 'Tanggal', key: 'createdAt', width: 20 },
        ];
        worksheet.addRows(expenses.map((expense) => ({
            category: expense.category.name,
            description: expense.description,
            amount: expense.amount,
            createdAt: (0, date_fns_1.format)(expense.createdAt, 'dd-MM-yyyy'),
        })));
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }
    async create(createExpenseDto) {
        const { categoryId, amount, description } = createExpenseDto;
        const category = await this.findCategory(categoryId);
        const expense = this.expenseRepo.create({
            amount,
            description,
            category,
        });
        await this.expenseRepo.save(expense);
        return expense;
    }
    async delete(id) {
        const expense = await this.find(id);
        return await this.expenseRepo.delete(expense.id);
    }
    async findCategory(id) {
        const category = await this.expenseCategoryRepo.findOne({
            where: { id },
        });
        if (!category)
            throw new common_1.NotFoundException('Kategori gak ketemu');
        return category;
    }
    async findAllCategories() {
        const categories = await this.expenseCategoryRepo
            .createQueryBuilder('category')
            .leftJoin('category.expenseTransaction', 'expense')
            .loadRelationCountAndMap('category.transactionCount', 'category.expenseTransaction')
            .getMany();
        return categories;
    }
    async getCategorySummary({ dateFrom, range }) {
        const query = this.expenseCategoryRepo
            .createQueryBuilder('category')
            .select('SUM(expense.amount)', 'totalAmount')
            .addSelect('COUNT(expense.id)', 'totalCount')
            .addSelect('category.name', 'name')
            .addSelect((qb) => {
            const subquery = qb.select('sum(expense.amount)').from(entities_1.Expense, 'expense');
            this.assignDateFilter(dateFrom, range, subquery);
            return subquery;
        }, 'expenseTotal')
            .leftJoin('category.expenseTransaction', 'expense');
        this.assignDateFilter(dateFrom, range, query);
        query.groupBy('category.id');
        const result = await query.getRawMany();
        const categorySummary = result.map((item) => ({
            name: item.name,
            totalAmount: parseFloat(item.totalAmount) || 0,
            totalCount: parseInt(item.totalCount, 10) || 0,
            percentage: (((+item.totalAmount || 1) / (+item.expenseTotal || 1)) * 100).toFixed(2),
        }));
        return categorySummary;
    }
    async createCategory(createCategoryDto) {
        const category = this.expenseCategoryRepo.create(createCategoryDto);
        this.expenseCategoryRepo.save(category);
        return category;
    }
    async updateCategory(id, updateCategoryDto) {
        const category = await this.findCategory(id);
        const updatedCategory = this.expenseCategoryRepo.merge(category, updateCategoryDto);
        await this.expenseCategoryRepo.save(updatedCategory);
        return updatedCategory;
    }
    async deleteCategory(id) {
        const category = await this.findCategory(id);
        await this.expenseCategoryRepo.remove(category);
        return category;
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
        query.where('expense.createdAt BETWEEN :from AND :to', { from, to });
    }
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expense_category_entity_1.ExpenseCategory)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Expense)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ExpenseService);
//# sourceMappingURL=expense.service.js.map