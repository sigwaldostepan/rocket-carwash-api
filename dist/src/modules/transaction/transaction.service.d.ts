import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionDetail } from './entities';
import { Repository } from 'typeorm';
import { Item } from '../item/entities/item.entity';
import { CustomerService } from '../customer/customer.service';
import { Customer } from '../customer/entities/customer.entity';
import { FindTransactionDto } from './dto/find-transaction.dto';
import * as ExcelJS from 'exceljs';
export declare class TransactionService {
    private readonly custService;
    private readonly transRepo;
    private readonly transDetailRepo;
    private readonly itemRepo;
    private readonly custRepo;
    constructor(custService: CustomerService, transRepo: Repository<Transaction>, transDetailRepo: Repository<TransactionDetail>, itemRepo: Repository<Item>, custRepo: Repository<Customer>);
    findTransactions(findTransactionDto: FindTransactionDto): Promise<{
        transactions: Transaction[];
        total: number;
    }>;
    getTransactionSummary(findTransactionDto: FindTransactionDto): Promise<{
        transactionCount: number;
        transactionTotalAmount: number;
        paymentMethodSummary: any[];
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
        createdAt: Date;
    }>;
    deleteTransaction(id: string): Promise<Transaction>;
    private assignDateFilter;
    private getTransactionCount;
    private getTransactionTotalAmount;
    private getPaymentMethodSummary;
    private calculateTransTotal;
    private generateInvoiceNo;
}
