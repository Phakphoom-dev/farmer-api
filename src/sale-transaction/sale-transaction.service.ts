import { Injectable } from '@nestjs/common';
import { CreateSaleTransactionDto } from './dto/create-sale-transaction.dto';
import { SaleTransactionRepository } from './sale-transaction.repository';
import type { SaleTransaction, User } from '@prisma/client';

@Injectable()
export class SaleTransactionService {
  constructor(private saleTransactionRepository: SaleTransactionRepository) {}

  async createTransaction(
    user: User,
    createDto: CreateSaleTransactionDto,
  ): Promise<SaleTransaction> {
    return this.saleTransactionRepository.createSaleTransaction(
      user,
      createDto,
    );
  }
}
