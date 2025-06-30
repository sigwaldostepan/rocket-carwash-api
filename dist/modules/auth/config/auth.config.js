"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('auth', () => ({
    accessTokenCookieName: process.env.ACCESS_TOKEN_COOKIE_NAME,
    refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME,
}));
//# sourceMappingURL=auth.config.js.map