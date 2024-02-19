import { Module } from '@nestjs/common';
import { SaleTransactionService } from './sale-transaction.service';
import { SaleTransactionController } from './sale-transaction.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SaleTransactionService],
  controllers: [SaleTransactionController],
})
export class SaleTransactionModule {}
