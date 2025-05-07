import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ default: 0, nullable: true })
  point: number = 0;
}
