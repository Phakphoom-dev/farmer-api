import { FabricNetworkConfigService } from 'src/fabric-network-config/fabric-network-config.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/common/decorators/user/get-user.decorator';
import { FabricNetworkService } from './fabric-network.service';
import { RoleEnum } from 'src/auth/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role/roles.decorator';
import { FarmerProfileDto } from './dto/farmer-profile.dto';

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

  @Get('all-assets')
  async getAllAssets(@GetUser() user) {
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

      const assets = await this.fabricNetworkService.getAllAssets(contract);

      return { total: assets.length, data: assets };
    } catch (e) {
      throw new BadRequestException(e.details);
    } finally {
      gateway.close();
      client.close();
    }
  }

  @Post('create-asset')
  async createAsset(@Body() assetDto: FarmerProfileDto, @GetUser() user) {
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

      await this.fabricNetworkService.createAsset(contract, assetDto);

      return {
        message: 'created success',
        status: HttpStatus.CREATED,
      };
    } catch (e) {
      throw new BadRequestException(e.details);
    } finally {
      gateway.close();
      client.close();
    }
  }
}
