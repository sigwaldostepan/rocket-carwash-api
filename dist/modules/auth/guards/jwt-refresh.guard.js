"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtRefreshAuthGuard = void 0;
const passport_1 = require("@nestjs/passport");
class JwtRefreshAuthGuard extends (0, passport_1.AuthGuard)('jwt-refresh') {
}
exports.JwtRefreshAuthGuard = JwtRefreshAuthGuard;
//# sourceMappingURL=jwt-refresh.guard.js.map