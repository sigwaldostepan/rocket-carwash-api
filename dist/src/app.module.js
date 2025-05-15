"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const user_module_1 = require("./modules/user/user.module");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./database/database.module");
const core_1 = require("@nestjs/core");
const logger_interceptor_1 = require("./common/interceptors/logger.interceptor");
const auth_module_1 = require("./modules/auth/auth.module");
const customer_module_1 = require("./modules/customer/customer.module");
const app_controller_1 = require("./app.controller");
const item_module_1 = require("./modules/item/item.module");
const jwt_config_1 = __importDefault(require("./modules/auth/config/jwt.config"));
const auth_config_1 = __importDefault(require("./modules/auth/config/auth.config"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: ['env.development, .env'],
                isGlobal: true,
                load: [jwt_config_1.default, auth_config_1.default],
            }),
            database_module_1.DatabaseModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            customer_module_1.CustomerModule,
            item_module_1.ItemModule,
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logger_interceptor_1.LoggerInterceptor,
            },
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map