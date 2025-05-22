import { TransactionDetail } from 'src/modules/transaction/entities/transaction-detail.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'numeric' })
  price: number;

  @OneToMany(() => TransactionDetail, (transaction) => transaction.item, {
    cascade: true,
  })
  transactionDetail: TransactionDetail;
}
