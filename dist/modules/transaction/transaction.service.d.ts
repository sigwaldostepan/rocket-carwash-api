import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionDetail } from './entities';
import { Repository } from 'typeorm';
import { Item } from '../item/entities/item.entity';
import { CustomerService } from '../customer/customer.service';
import { Customer } from '../customer/entities/customer.entity';
import { FindTransactionDto } from './dto/find-transaction.dto';
import * as ExcelJS from 'exceljs';
import { ExpenseService } from '../expense/expense.service';
export declare class TransactionService {
    private readonly custService;
    private readonly transRepo;
    private readonly transDetailRepo;
    private readonly itemRepo;
    private readonly custRepo;
    private readonly expenseService;
    constructor(custService: CustomerService, transRepo: Repository<Transaction>, transDetailRepo: Repository<TransactionDetail>, itemRepo: Repository<Item>, custRepo: Repository<Customer>, expenseService: ExpenseService);
    findTransactions(findTransactionDto: FindTransactionDto): Promise<{
        transactions: Transaction[];
        total: number;
    }>;
    getTransactionSummary(findTransactionDto: FindTransactionDto): Promise<{
        transactionCount: number;
        transactionTotalAmount: number;
        paymentMethodSummary: {
            percentage: string | number;
            paymentMethod: string;
            count: number;
            totalAmount: number;
        }[];
        complimentSummary: {
            normalCompliment: {
                value: number;
                count: number;
                percentage: string;
            };
            nightShiftCompliment: {
                value: number;
                count: number;
                percentage: string | number;
            };
        };
        netIncome: number;
        totalExpense: number;
    }>;
    exportTransactionsExcel(exportTransactionExcelDto: FindTransactionDto): Promise<ExcelJS.Buffer>;
    findTransactionById(id: string): Promise<Transaction>;
    createTransaction(createTransactionDto: CreateTransactionDto): Promise<{
        details: TransactionDetail[];
        id: string;
        invoiceNo: string;
        customer: Customer;
        transTotal: number;
        paymentMethod: string;
        isCompliment?: boolean;
        complimentValue: number;
        isNightShift: boolean;
        createdAt: Date;
    }>;
    deleteTransaction(id: string): Promise<Transaction>;
    private assignDateFilter;
    private getTransactionCount;
    private getTransactionTotalAmount;
    private getPaymentMethodSummary;
    private getComplimentSummary;
    private getNetIncomeAndTotalExpenses;
    private formatSummaryResponse;
    private calculateTransTotal;
    private generateInvoiceNo;
}
