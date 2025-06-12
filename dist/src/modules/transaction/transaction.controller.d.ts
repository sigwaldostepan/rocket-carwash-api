import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindTransactionDto } from './dto/find-transaction.dto';
import { Response } from 'express';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    findTransactions(findTransactionDto: FindTransactionDto): Promise<{
        data: import("./entities").Transaction[];
        meta: {
            currentPage: number;
            perPage: number;
            totalItems: number;
            totalPages: number;
        };
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
                percentage: number;
            };
        };
    }>;
    exportTransactions(exportTransactionExcelDto: FindTransactionDto, res: Response): Promise<Response<any, Record<string, any>>>;
    findOne(id: string): Promise<import("./entities").Transaction>;
    create(createTransactionDto: CreateTransactionDto): Promise<{
        details: import("./entities").TransactionDetail[];
        id: string;
        invoiceNo: string;
        customer: import("../customer/entities/customer.entity").Customer;
        transTotal: number;
        paymentMethod: string;
        isCompliment?: boolean;
        complimentValue: number;
        isNightShift: boolean;
        createdAt: Date;
    }>;
    remove(id: string): Promise<import("./entities").Transaction>;
}
