"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerInterceptor = void 0;
const rxjs_1 = require("rxjs");
class LoggerInterceptor {
    intercept(ctx, next) {
        const req = ctx.switchToHttp().getRequest();
        const now = Date.now();
        console.log(`[Request] ${req.method} ${req.url}`);
        return next.handle().pipe((0, rxjs_1.tap)((data) => {
            console.log(`[Response] ${req.method} ${req.url} - ${Date.now() - now}ms`);
            console.log(`Response Data:`, data);
        }));
    }
}
exports.LoggerInterceptor = LoggerInterceptor;
//# sourceMappingURL=logger.interceptor.js.map