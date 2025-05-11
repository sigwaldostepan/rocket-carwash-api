"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateResponse = void 0;
const paginateResponse = (data, currentPage, perPage, totalItems) => {
    const totalPages = Math.ceil(totalItems / perPage);
    return {
        data,
        meta: {
            currentPage,
            perPage,
            totalItems,
            totalPages,
        },
    };
};
exports.paginateResponse = paginateResponse;
//# sourceMappingURL=pagination.helper.js.map