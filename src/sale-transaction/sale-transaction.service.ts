import { Injectable } from '@nestjs/common';
import { CreateSaleTransactionDto } from './dto/create-sale-transaction.dto';
import type { SaleTransaction, User } from '@prisma/client';
import { RecordType } from '../common/types/recordType';
import { PrismaService } from '../prisma/prisma.service';
import { Contract } from '@hyperledger/fabric-gateway';
import { v4 as uuidv4 } from 'uuid';

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

  async createNetworkTransaction(
    contract: Contract,
    user: User,
    createDto: CreateSaleTransactionDto,
  ) {
    const payload: RecordType = {
      id: uuidv4(),
      userId: user.id,
      ...createDto,
    };

    console.log('\n--> Submit Transaction: CreateTransactionAsset');
    await contract.submitTransaction(
      'CreateAsset',
      payload.id,
      payload.description,
      payload.unitPrice.toString(),
      payload.amount.toString(),
      payload.userId.toString(),
    );
    console.log('*** Transaction committed successfully');
  }
}
