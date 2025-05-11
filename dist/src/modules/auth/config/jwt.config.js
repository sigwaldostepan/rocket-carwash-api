"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('jwt', () => ({
    secret: process.env.JWT_SECRET,
    expirationTime: +process.env.JWT_EXPIRATION,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpirationTime: +process.env.REFRESH_TOKEN_EXPIRATION,
}));
//# sourceMappingURL=jwt.config.js.map