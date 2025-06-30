import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
export declare class Customer {
    id: string;
    code: string;
    name: string;
    phoneNumber: string;
    point: number;
    transaction: Transaction[];
}
