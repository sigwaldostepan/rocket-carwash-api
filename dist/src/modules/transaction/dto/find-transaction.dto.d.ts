import { PaginationDto } from 'src/common/dto';
export declare class FindTransactionDto extends PaginationDto {
    dateFrom?: string;
    range?: string;
}
