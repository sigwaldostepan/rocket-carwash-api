import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PaginationDto } from 'src/common/dto';
import { paginateResponse } from 'src/common/helpers';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  public async findTransactions(@Query() paginationDto: PaginationDto) {
    const { transactions, total } = await this.transactionService.findTransactions(paginationDto);

    return paginateResponse(transactions, paginationDto.page, paginationDto.limit, total);
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
