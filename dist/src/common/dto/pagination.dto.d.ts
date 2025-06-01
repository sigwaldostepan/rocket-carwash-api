export declare class PaginationDto {
    page?: number;
    limit?: number;
    by?: string;
    get offset(): number;
}
