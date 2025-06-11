import { TransactionDetail } from './transaction-detail.entity';
import { Customer } from 'src/modules/customer/entities/customer.entity';
export declare class Transaction {
    id: string;
    invoiceNo: string;
    details: TransactionDetail[];
    customer: Customer;
    transTotal: number;
    paymentMethod: string;
    isCompliment?: boolean;
    complimentValue: number;
    isNightShift: boolean;
    createdAt: Date;
}
