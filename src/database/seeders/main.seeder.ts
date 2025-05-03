import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { options as appDataSourceOptions } from '../typeorm.config';
import CustomerSeeder from './customer.seeder';

const options: DataSourceOptions & SeederOptions = {
  ...appDataSourceOptions,
  seeds: [CustomerSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);

  process.exit();
});
