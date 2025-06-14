import { ExpenseService } from './expense.service';
import { CreateExpenseCategoryDto, CreateExpenseDto } from './dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { FindExpensesDto } from './dto/find-expenses.dto';
import { Response } from 'express';
export declare class ExpenseController {
    private readonly expenseService;
    constructor(expenseService: ExpenseService);
    findAll(findExpensesDto: FindExpensesDto): Promise<{
        data: import("./entities").Expense[];
        meta: {
            currentPage: number;
            perPage: number;
            totalItems: number;
            totalPages: number;
        };
    }>;
    getSummary(findExpensesDto: FindExpensesDto): Promise<{
        summary: {
            totalAmount: number;
            totalCount: number;
        };
        categorySummary: {
            name: any;
            totalAmount: number;
            totalCount: number;
            percentage: string;
        }[];
    }>;
    exportSummaryToExcel(findExpensesDto: FindExpensesDto, res: Response): Promise<Response<any, Record<string, any>>>;
    create(createCategoryDto: CreateExpenseDto): Promise<import("./entities").Expense>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
    createCategory(createExpenseCategoryDto: CreateExpenseCategoryDto): Promise<import("./entities").ExpenseCategory>;
    updateCategory(id: string, updateExpenseCategoryDto: UpdateExpenseCategoryDto): any;
    findAllCategories(): Promise<import("./entities").ExpenseCategory[]>;
    findCategory(id: string): Promise<import("./entities").ExpenseCategory>;
}
