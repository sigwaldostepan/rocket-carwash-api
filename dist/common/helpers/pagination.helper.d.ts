export declare const paginateResponse: <T>(data: T[], currentPage: number, perPage: number, totalItems: number) => {
    data: T[];
    meta: {
        currentPage: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
    };
};
