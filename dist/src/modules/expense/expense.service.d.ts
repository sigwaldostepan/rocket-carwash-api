import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateExpenseCategoryDto, FindExpensesDto, GetExpenseCategorySummary, UpdateExpenseCategoryDto } from './dto';
import { ExpenseCategory } from './entities/expense-category.entity';
import { Repository } from 'typeorm';
import { Expense } from './entities';
import * as ExcelJS from 'exceljs';
export declare class ExpenseService {
    private readonly expenseCategoryRepo;
    private readonly expenseRepo;
    constructor(expenseCategoryRepo: Repository<ExpenseCategory>, expenseRepo: Repository<Expense>);
    findAll({ description, limit, offset, range, dateFrom }: FindExpensesDto): Promise<{
        expenses: Expense[];
        count: number;
    }>;
    find(id: string): Promise<Expense>;
    getSummary({ dateFrom, range, description }: FindExpensesDto): Promise<{
        totalAmount: number;
        totalCount: number;
    }>;
    exportExcel(findExpensesDto: FindExpensesDto): Promise<ExcelJS.Buffer>;
    create(createExpenseDto: CreateExpenseDto): Promise<Expense>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
    findCategory(id: string): Promise<ExpenseCategory>;
    findAllCategories(): Promise<ExpenseCategory[]>;
    getCategorySummary({ dateFrom, range }: GetExpenseCategorySummary): Promise<{
        name: any;
        totalAmount: number;
        totalCount: number;
        percentage: string;
    }[]>;
    createCategory(createCategoryDto: CreateExpenseCategoryDto): Promise<ExpenseCategory>;
    updateCategory(id: string, updateCategoryDto: UpdateExpenseCategoryDto): Promise<ExpenseCategory>;
    private assignDateFilter;
}
