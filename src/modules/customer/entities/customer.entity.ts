import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerPlate } from './customer-plate.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  point: number;

  @OneToMany(() => CustomerPlate, (customerPlate) => customerPlate.customer)
  customerPlates: CustomerPlate[];
}
