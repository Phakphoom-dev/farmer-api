import { Module } from '@nestjs/common';
import { DataImportService } from './data-import.service';
import { DataImportController } from './data-import.controller';
import { PrismaService } from '../prisma/prisma.service';
import { FabricNetworkService } from '../fabric-network/fabric-network.service';
import { FabricNetworkConfigService } from 'src/fabric-network-config/fabric-network-config.service';

@Module({
  providers: [
    DataImportService,
    PrismaService,
    FabricNetworkService,
    FabricNetworkConfigService,
  ],
  controllers: [DataImportController],
})
export class DataImportModule {}
