import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionDetail } from './transaction-detail.entity';
import { Customer } from 'src/modules/customer/entities/customer.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  invoiceNo: string;

  @OneToMany(() => TransactionDetail, (detail) => detail.transaction, {
    cascade: true,
  })
  details: TransactionDetail[];

  @ManyToOne(() => Customer, (customer) => customer.transaction, {
    onDelete: 'CASCADE',
  })
  customer: Customer;

  @Column()
  transTotal: number;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ default: false })
  isCompliment?: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;
}
