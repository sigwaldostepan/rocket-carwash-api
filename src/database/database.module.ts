import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from './typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot({ ...options, autoLoadEntities: true, logging: true })],
})
export class DatabaseModule {}
