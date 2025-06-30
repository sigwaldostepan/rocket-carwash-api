import { Expense } from './expense.entity';
export declare class ExpenseCategory {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    expenseTransaction: Expense;
}
