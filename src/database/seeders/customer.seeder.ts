import data from '../../../data/customer_data.json';
import { Customer } from '../../modules/customer/entities/customer.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class CustomerSeeder implements Seeder {
  async run(dataSource: DataSource) {
    const customerRepo = dataSource.getRepository(Customer);

    console.log('Seeding customer data...');

    // map through customer data
    for (const customer of data) {
      // saving customer data into database
      const { code, phone_number, point, name } = customer;
      const customerEntity = customerRepo.create({
        code,
        name: String(name),
        phoneNumber: phone_number,
        point,
      });

      await customerRepo.save(customerEntity);
    }
  }
}
