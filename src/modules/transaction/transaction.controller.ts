import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { paginateResponse } from 'src/common/helpers';
import { FindTransactionDto } from './dto/find-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  public async findTransactions(@Query() findTransactionDto: FindTransactionDto) {
    const { transactions, total } = await this.transactionService.findTransactions(findTransactionDto);

    return paginateResponse(transactions, findTransactionDto.page, findTransactionDto.limit, total);
  }

  @Get('/summary')
  public async getTransactionSummary(@Query() findTransactionDto: FindTransactionDto) {
    return await this.transactionService.getTransactionSummary(findTransactionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findTransactionById(id);
  }

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.deleteTransaction(id);
  }
}
