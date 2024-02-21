import { Module } from '@nestjs/common';
import { FabricNetworkConfigService } from './fabric-network-config.service';

@Module({
  providers: [FabricNetworkConfigService],
  exports: [FabricNetworkConfigService],
})
export class FabricNetworkConfigModule {}
