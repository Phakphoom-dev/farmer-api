import { Injectable } from '@nestjs/common';
import { CreateSaleTransactionDto } from './dto/create-sale-transaction.dto';
import type { SaleTransaction, User } from '@prisma/client';
import { RecordType } from '../types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaleTransactionService {
  constructor(private prismaService: PrismaService) {}

  async createTransaction(
    user: User,
    createDto: CreateSaleTransactionDto,
  ): Promise<SaleTransaction> {
    return this.prismaService.saleTransaction.create({
      data: {
        ...createDto,
        userId: user.id,
      },
    });
  }

  async getTransactions(filters: RecordType) {
    return this.prismaService.saleTransaction.findMany({
      where: {
        ...filters,
      },
    });
  }
}
