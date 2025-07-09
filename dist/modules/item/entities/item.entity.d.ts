import { TransactionDetail } from 'src/modules/transaction/entities/transaction-detail.entity';
export declare class Item {
    id: string;
    name: string;
    price: number;
    isRedeemable: boolean;
    isGetPoint: boolean;
    canBeComplimented: boolean;
    transactionDetail: TransactionDetail;
}
