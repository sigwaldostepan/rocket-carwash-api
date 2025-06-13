import { PaginationDto } from 'src/common/dto';
export declare class FindExpensesDto extends PaginationDto {
    dateFrom?: string;
    description?: string;
    range?: string;
}
