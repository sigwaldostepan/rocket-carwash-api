import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: false,
};

const AppDataSource = new DataSource(options);

export default AppDataSource;
