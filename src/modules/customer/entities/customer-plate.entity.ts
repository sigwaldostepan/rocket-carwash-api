import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
export class CustomerPlate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'plate_number' })
  plateNumber: string;

  @ManyToOne(() => Customer, (customer) => customer.customerPlates, { cascade: true })
  customer: Customer;
}
