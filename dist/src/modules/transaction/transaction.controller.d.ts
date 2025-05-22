import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PaginationDto } from 'src/common/dto';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    findTransactions(paginationDto: PaginationDto): Promise<{
        data: import("./entities").Transaction[];
        meta: {
            currentPage: number;
            perPage: number;
            totalItems: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities").Transaction>;
    create(createTransactionDto: CreateTransactionDto): Promise<{
        details: import("./entities").TransactionDetail[];
        id: string;
        invoiceNo: string;
        customer: import("../customer/entities/customer.entity").Customer;
        transTotal: number;
        paymentMethod: string;
        isCompliment?: boolean;
        createdAt: Date;
    }>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
