import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      migrations: [__dirname, './migrations/*.{ts,js}'],
      logging: true,
      synchronize: process.env.NODE_ENV === 'development' ? true : false,
    }),
  ],
})
export class DatabaseModule {}
