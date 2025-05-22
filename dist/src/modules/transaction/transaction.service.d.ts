import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionDetail } from './entities';
import { Repository } from 'typeorm';
import { Item } from '../item/entities/item.entity';
import { CustomerService } from '../customer/customer.service';
import { PaginationDto } from 'src/common/dto';
import { Customer } from '../customer/entities/customer.entity';
export declare class TransactionService {
    private readonly custService;
    private readonly transRepo;
    private readonly transDetailRepo;
    private readonly itemRepo;
    private readonly custRepo;
    constructor(custService: CustomerService, transRepo: Repository<Transaction>, transDetailRepo: Repository<TransactionDetail>, itemRepo: Repository<Item>, custRepo: Repository<Customer>);
    findTransactions(paginationDto: PaginationDto): Promise<{
        transactions: Transaction[];
        total: number;
    }>;
    findTransactionById(id: string): Promise<Transaction>;
    createTransaction(createTransactionDto: CreateTransactionDto): Promise<{
        details: TransactionDetail[];
        id: string;
        invoiceNo: string;
        customer: Customer;
        transTotal: number;
        paymentMethod: string;
        isCompliment?: boolean;
        createdAt: Date;
    }>;
    deleteTransaction(id: string): Promise<import("typeorm").DeleteResult>;
    private generateInvoiceNo;
    private calculateTransTotal;
}
