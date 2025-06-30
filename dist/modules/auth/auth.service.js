"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const argon2_1 = require("argon2");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userService, configService, jwtService) {
        this.userService = userService;
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        return await this.userService.createUser(registerDto);
    }
    async validateLogin(loginDto) {
        const user = await this.userService.findByEmailAndGetPassword(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Email atau password invalid');
        }
        const passwordValid = await (0, argon2_1.verify)(user.password, loginDto.password);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Email atau password invalid');
        }
        const { accessToken, refreshToken } = await this.generateAuthTokens({
            sub: user.id,
            name: user.name,
            email: user.email,
        });
        delete user.password;
        return {
            refreshToken: refreshToken,
            accessToken,
            user,
        };
    }
    async refresh(userId) {
        const user = await this.userService.findById(+userId);
        const { accessToken, refreshToken } = await this.generateAuthTokens({
            email: user.name,
            name: user.name,
            sub: user.id,
        });
        return { user, accessToken, refreshToken };
    }
    async generateAuthTokens(payload) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ ...payload }, {
                secret: this.configService.getOrThrow('jwt.secret'),
                expiresIn: this.configService.getOrThrow('jwt.expirationTime'),
            }),
            this.jwtService.signAsync({ ...payload }, {
                secret: this.configService.getOrThrow('jwt.refreshTokenSecret'),
                expiresIn: this.configService.getOrThrow('jwt.refreshTokenExpirationTime'),
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        config_1.ConfigService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map