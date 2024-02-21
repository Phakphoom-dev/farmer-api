import { Module } from '@nestjs/common';
import { FabricNetworkService } from './fabric-network.service';
import { FabricNetworkController } from './fabric-network.controller';
import { FabricNetworkConfigService } from '../fabric-network-config/fabric-network-config.service';

@Module({
  providers: [FabricNetworkService, FabricNetworkConfigService],
  controllers: [FabricNetworkController],
})
export class FabricNetworkModule {}
