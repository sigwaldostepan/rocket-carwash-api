"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class ValidationPipe extends common_1.ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            exceptionFactory: (errors) => {
                const formattedErrors = errors.map((error) => {
                    return {
                        field: error.property,
                        message: Object.values(error.constraints)[0],
                    };
                });
                return new common_1.BadRequestException({
                    message: 'Validation error',
                    errors: formattedErrors,
                });
            },
        });
    }
}
exports.ValidationPipe = ValidationPipe;
//# sourceMappingURL=validation.pipe.js.map