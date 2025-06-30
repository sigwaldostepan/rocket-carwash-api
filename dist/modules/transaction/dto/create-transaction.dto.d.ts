export declare class TransactionItemDto {
    itemId: string;
    quantity: number;
    redeemedQuantity?: number;
}
export declare class CreateTransactionDto {
    customerId: string;
    items: TransactionItemDto[];
    paymentMethod: string;
    isCompliment?: boolean;
    complimentAmount: number;
    isNightShift?: boolean;
}
