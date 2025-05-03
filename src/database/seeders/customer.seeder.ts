import data from '../../../data/customer_data.json';
import { Customer } from '../../modules/customer/entities/customer.entity';
import { CustomerPlate } from '../../modules/customer/entities/customer-plate.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class CustomerSeeder implements Seeder {
  async run(dataSource: DataSource) {
    const customerRepo = dataSource.getRepository(Customer);
    const plateRepo = dataSource.getRepository(CustomerPlate);

    console.log('Seeding customer data...');

    // map through customer data
    for (const customer of data) {
      // migrating old customer data into database
      const { code, phone_number, point } = customer;
      const customerEntity = customerRepo.create({
        code,
        phoneNumber: phone_number,
        point,
      });

      await customerRepo.save(customerEntity);

      // inserting 'name' which basically vehicle plate number into new table
      const plates = String(customer.name)
        .split(', ')
        .map((rawPlates) => rawPlates.trim());

      const plateEntity = plates.map((plate) =>
        plateRepo.create({
          plateNumber: plate,
          customer: customerEntity,
        }),
      );

      await plateRepo.save(plateEntity);
    }
  }
}
