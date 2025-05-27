import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
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

  private calculateTransTotal(detail: TransactionDetail[], isCompliment: boolean, complimentAmount: number) {
    const transTotal = detail.reduce((total, detail) => {
      const { item, quantity, redeemedQuantity } = detail;

      if (redeemedQuantity > quantity) {
        throw new UnprocessableEntityException('Jumlah diredeem gak lebih banyak dari jumlah itemnya yg diorder dong');
      }

      let subtotal = 0;

      if (redeemedQuantity > 0) {
        const unredeemedValue = quantity * item.price - redeemedQuantity * item.price;
        subtotal = Number(total) + unredeemedValue;

        return subtotal;
      }

      subtotal = Number(total) + item.price * quantity;

      if (isCompliment) {
        complimentAmount > subtotal ? (subtotal -= subtotal) : (subtotal -= complimentAmount);
      }

      return subtotal;
    }, 0);

    return transTotal;
  }

  public async createTransaction(createTransactionDto: CreateTransactionDto) {
    let customer = null;

    if (createTransactionDto.customerId) {
      customer = await this.custService.findCustomerById(createTransactionDto.customerId);
    }

    const dtoItemsId = createTransactionDto.items.map((dtoItem) => dtoItem.itemId);
    const items = await this.itemRepo.find({
      where: {
        id: In(dtoItemsId),
      },
    });

    const foundItemIds = items.map((item) => item.id);
    const notFoundItems = createTransactionDto.items.filter((dtoItem) => !foundItemIds.includes(dtoItem.itemId));

    if (notFoundItems.length > 0) {
      throw new NotFoundException(`Item dgn id ${notFoundItems.join(', ')} gak ketemu`);
    }

    const totalRedeemedItems = createTransactionDto.items.reduce(
      (total, item) => total + (item.redeemedQuantity ?? 0),
      0,
    );
    const isRedeemPoints = totalRedeemedItems > 0;

    if (!customer && isRedeemPoints) {
      throw new UnprocessableEntityException('Transaksi tanpa customer, tidak bisa redeem point');
    }

    if (isRedeemPoints && customer) {
      const requiredPoint = REDEEM_POINT_COST * totalRedeemedItems;
      if (customer.point < requiredPoint) {
        throw new BadRequestException('Point customer gak cukup');
      }

      customer.point -= requiredPoint;
    }

    const additionalPointTransation = !isRedeemPoints;

    if (additionalPointTransation && customer) {
      customer.point += POINT_REWARD;
    }

    const itemMap = new Map(items.map((item) => [item.id, item]));
    const transactionDetail: TransactionDetail[] = createTransactionDto.items.map((dtoItem) => {
      const isRedeemed = dtoItem.redeemedQuantity > 0;
      const matchedItem = itemMap.get(dtoItem.itemId);
      if (!matchedItem) {
        throw new NotFoundException(`Item ${matchedItem.name} gak ketemu`);
      }

      if (!matchedItem.isRedeemable && isRedeemed) {
        throw new UnprocessableEntityException(`Item ${matchedItem.name} gak bisa diredeem`);
      }

      const entity = this.transDetailRepo.create({
        item: matchedItem,
        quantity: dtoItem.quantity,
        redeemedQuantity: dtoItem.redeemedQuantity ?? 0,
      });

      return entity;
    });

    const invoiceNo = await this.generateInvoiceNo();

    if (customer) {
      await this.custRepo.update(customer.id, { point: customer.point });
    }

    const transaction = this.transRepo.create({
      invoiceNo,
      customer,
      transTotal: this.calculateTransTotal(
        transactionDetail,
        createTransactionDto.isCompliment,
        createTransactionDto.complimentAmount,
      ),
      isCompliment: createTransactionDto.isCompliment,
      paymentMethod: createTransactionDto.paymentMethod,
      details: transactionDetail,
      complimentValue: createTransactionDto.complimentAmount ?? 0,
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
}
