import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AppController } from './app.controller';
import { ItemModule } from './modules/item/item.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ExpenseModule } from './modules/expense/expense.module';
import jwtConfig from './modules/auth/config/jwt.config';
import authConfig from './modules/auth/config/auth.config';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['env.development, .env'],
      isGlobal: true,
      load: [jwtConfig, authConfig],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    CustomerModule,
    ItemModule,
    TransactionModule,
    ExpenseModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
