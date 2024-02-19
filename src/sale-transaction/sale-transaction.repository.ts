import { CreateSaleTransactionDto } from './dto/create-sale-transaction.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { SaleTransaction, User } from '@prisma/client';

@Injectable()
export class SaleTransactionRepository {
  constructor(private prismaService: PrismaService) {}

  async createSaleTransaction(
    user: User,
    params: CreateSaleTransactionDto,
  ): Promise<SaleTransaction> {
    return this.prismaService.saleTransaction.create({
      data: {
        ...params,
        userId: user.id,
      },
    });
  }

  async getTransactions(params: Partial<SaleTransaction>) {
    return this.prismaService.saleTransaction.findMany({
      where: {
        ...params,
      },
    });
  }
}
