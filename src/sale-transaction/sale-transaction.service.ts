import { Injectable } from '@nestjs/common';
import { CreateSaleTransactionDto } from './dto/create-sale-transaction.dto';
import { SaleTransactionRepository } from './sale-transaction.repository';
import type { SaleTransaction, User } from '@prisma/client';
import { RecordType } from 'src/types';

@Injectable()
export class SaleTransactionService {
  constructor(private saleTransactionRepository: SaleTransactionRepository) {}

  async createTransaction(
    user: User,
    createDto: CreateSaleTransactionDto,
  ): Promise<SaleTransaction> {
    return await this.saleTransactionRepository.createSaleTransaction(
      user,
      createDto,
    );
  }

  async getTransactions(filters: RecordType) {
    return await this.saleTransactionRepository.getTransactions(filters);
  }
}
