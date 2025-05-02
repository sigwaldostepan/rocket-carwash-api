import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import jwtConfig from './modules/auth/config/jwt.config';
import authConfig from './modules/auth/config/auth.config';

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
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
