import { FabricNetworkConfigService } from 'src/fabric-network-config/fabric-network-config.service';
import {
  BadRequestException,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/common/decorators/user/get-user.decorator';
import { FabricNetworkService } from './fabric-network.service';
import { RoleEnum } from 'src/auth/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role/roles.decorator';

@Controller('fabric-network')
@UseGuards(JwtAuthGuard)
export class FabricNetworkController {
  constructor(
    private fabricNetworkService: FabricNetworkService,
    private fabricNetworkConfigService: FabricNetworkConfigService,
  ) {}

  @Post('init-ledger')
  @Roles(RoleEnum.ADMIN)
  async initLedger(@GetUser() user) {
    await this.fabricNetworkService.displayInputParameters();

    const { client, gateway } =
      await this.fabricNetworkService.connectNetwork(user);

    try {
      // Get a network instance representing the channel where the smart contract is deployed.
      const network = gateway.getNetwork(
        this.fabricNetworkConfigService.channelName,
      );

      // Get the smart contract from the network.
      const contract = network.getContract(
        this.fabricNetworkConfigService.chaincodeName,
      );

      await this.fabricNetworkService.initLedger(contract);

      return {
        message: 'Init ledger success',
      };
    } catch (e) {
      throw new BadRequestException(e);
    } finally {
      gateway.close();
      client.close();
    }
  }
}
