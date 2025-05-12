"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInterceptor = void 0;
const rxjs_1 = require("rxjs");
class TokenInterceptor {
    intercept(ctx, next) {
        const res = ctx.switchToHttp().getResponse();
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            const isDev = process.env.NODE_ENV === 'development';
            if (data.accessToken && data.refreshToken) {
                res.cookie(process.env.ACCESS_TOKEN_COOKIE_NAME, data.accessToken, {
                    httpOnly: true,
                    secure: isDev ? false : true,
                    sameSite: isDev ? 'lax' : 'none',
                    maxAge: +process.env.JWT_EXPIRATION * 1000,
                    path: '/',
                });
                res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, data.refreshToken, {
                    httpOnly: true,
                    secure: isDev ? false : true,
                    sameSite: isDev ? 'lax' : 'none',
                    maxAge: +process.env.REFRESH_TOKEN_EXPIRATION * 1000,
                    path: '/',
                });
                delete data.refreshToken;
            }
            return data;
        }));
    }
}
exports.TokenInterceptor = TokenInterceptor;
//# sourceMappingURL=token.interceptor.js.map