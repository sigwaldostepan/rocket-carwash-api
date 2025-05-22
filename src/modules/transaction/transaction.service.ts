import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionDetail } from './entities';
import { Between, In, Repository } from 'typeorm';
import { Item } from '../item/entities/item.entity';
import { CustomerService } from '../customer/customer.service';
import { PaginationDto } from 'src/common/dto';
import { Customer } from '../customer/entities/customer.entity';
import { POINT_REWARD, REDEEM_POINT_COST } from './transaction.constant';

@Injectable()
export class TransactionService {
  constructor(
    private readonly custService: CustomerService,
    @InjectRepository(Transaction)
    private readonly transRepo: Repository<Transaction>,
    @InjectRepository(TransactionDetail)
    private readonly transDetailRepo: Repository<TransactionDetail>,
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
    @InjectRepository(Customer)
    private readonly custRepo: Repository<Customer>,
  ) {}

  public async findTransactions(paginationDto: PaginationDto) {
    const [transactions, total] = await this.transRepo
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.details', 'details')
      .leftJoinAndSelect('details.item', 'item')
      .orderBy('transaction.invoiceNo', 'ASC')
      .take(paginationDto.limit)
      .skip(paginationDto.offset)
      .getManyAndCount();

    return {
      transactions,
      total,
    };
  }

  public async findTransactionById(id: string) {
    const transaction = await this.transRepo.findOne({
      where: {
        id,
      },
      relations: ['details', 'details.item'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaksi gak ketemu');
    }

    return transaction;
  }

  public async createTransaction(createTransactionDto: CreateTransactionDto) {
    const customer = await this.custService.findCustomerById(createTransactionDto.customerId);

    const items = await this.itemRepo.find({
      where: {
        id: In(createTransactionDto.items),
      },
    });

    const foundItemIds = items.map((item) => item.id);
    const notFoundItems = createTransactionDto.items.filter((id) => !foundItemIds.includes(id));

    if (notFoundItems.length > 0) {
      throw new NotFoundException(`Item dgn id ${notFoundItems.join(', ')} gak ketemu`);
    }

    const isRedeemPoints = createTransactionDto.redeemedItems.length > 0;
    const totalRedeemedItems = createTransactionDto.redeemedItems.length;

    if (isRedeemPoints) {
      const requiredPoint = REDEEM_POINT_COST * totalRedeemedItems;
      if (customer.point < requiredPoint) {
        throw new BadRequestException('Point customer gak cukup');
      }
      customer.point -= requiredPoint;
    }

    const canEarnPoint = !isRedeemPoints;

    if (canEarnPoint) {
      customer.point += POINT_REWARD;
    }

    const transactionDetail: TransactionDetail[] = items.map((item) => {
      const isRedeemed = isRedeemPoints ? createTransactionDto.redeemedItems.includes(item.id) : false;

      return this.transDetailRepo.create({
        item,
        isRedeemed: isRedeemed,
      });
    });

    const invoiceNo = await this.generateInvoiceNo();

    await this.custRepo.update(customer.id, { point: customer.point });

    const transaction = this.transRepo.create({
      invoiceNo,
      customer,
      transTotal: this.calculateTransTotal(transactionDetail, createTransactionDto.isCompliment),
      isCompliment: createTransactionDto.isCompliment,
      paymentMethod: createTransactionDto.paymentMethod,
      details: transactionDetail,
    });
    await this.transRepo.save(transaction);

    return {
      ...transaction,
      details: transactionDetail,
    };
  }

  public async deleteTransaction(id: string) {
    const transaction = await this.findTransactionById(id);

    return await this.transRepo.delete(transaction.id);
  }

  private async generateInvoiceNo() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear() % 100).padStart(2, '0');

    const utcFrom = new Date(Date.UTC(now.getFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
    const utcTo = new Date(Date.UTC(now.getFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));

    const countToday = await this.transRepo.count({
      where: {
        createdAt: Between(utcFrom, utcTo),
      },
    });

    const formattedDate = `${year}${month}${day}`;

    const invoiceNo = `RO-${formattedDate}-${String(countToday + 1).padStart(4, '0')}`;

    return invoiceNo;
  }

  private calculateTransTotal(detail: TransactionDetail[], isCompliment: boolean) {
    if (isCompliment) {
      return 0;
    }

    const transTotal = detail.reduce((total, detail) => {
      return Number(total) + (detail.isRedeemed ? 0 : Number(detail.item.price));
    }, 0);

    return transTotal;
  }
}
