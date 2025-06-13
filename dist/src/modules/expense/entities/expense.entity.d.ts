import { ExpenseCategory } from './expense-category.entity';
export declare class Expense {
    id: string;
    description: string;
    amount: number;
    createdAt: Date;
    category: ExpenseCategory;
}
