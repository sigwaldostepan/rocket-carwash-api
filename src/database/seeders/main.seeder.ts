import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { options as appDataSourceOptions } from '../typeorm.config';
import TransactionSeeder from './transaction.seeder';

const options: DataSourceOptions & SeederOptions = {
  ...appDataSourceOptions,
  seeds: [TransactionSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  process.exit();
});
