import { Item } from 'src/modules/item/entities/item.entity';
import { Transaction } from './transaction.entity';
export declare class TransactionDetail {
    id: string;
    transaction: Transaction;
    item: Item;
    isRedeemed: boolean;
}
