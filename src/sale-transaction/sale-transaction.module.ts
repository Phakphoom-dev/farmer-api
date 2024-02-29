import { Module } from '@nestjs/common';
import { SaleTransactionService } from './sale-transaction.service';
import { SaleTransactionController } from './sale-transaction.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FabricNetworkConfigService } from '../fabric-network-config/fabric-network-config.service';
import { FabricNetworkService } from '../fabric-network/fabric-network.service';

@Module({
  imports: [PrismaModule],
  providers: [
    SaleTransactionService,
    FabricNetworkConfigService,
    FabricNetworkService,
  ],
  controllers: [SaleTransactionController],
})
export class SaleTransactionModule {}
