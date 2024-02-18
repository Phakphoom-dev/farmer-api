import { Module } from '@nestjs/common';
import { SaleTransactionService } from './sale-transaction.service';
import { SaleTransactionController } from './sale-transaction.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SaleTransactionRepository } from './sale-transaction.repository';

@Module({
  imports: [PrismaModule],
  providers: [SaleTransactionService, SaleTransactionRepository],
  controllers: [SaleTransactionController],
})
export class SaleTransactionModule {}
