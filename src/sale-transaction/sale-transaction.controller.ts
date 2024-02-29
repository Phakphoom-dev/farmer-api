import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateSaleTransactionDto } from './dto/create-sale-transaction.dto';
import { GetUser } from '../common/decorators/user/get-user.decorator';
import type { User } from '@prisma/client';
import { SaleTransactionService } from './sale-transaction.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateSaleTransactionResponseDto,
  SaleTransactionResponseDto,
} from './dto/sale-transaction-response.dto';
import { FabricNetworkService } from '../fabric-network/fabric-network.service';
import { FabricNetworkConfigService } from '../fabric-network-config/fabric-network-config.service';

@ApiTags('Sale Transaction')
@UseGuards(JwtAuthGuard)
@Controller('sale-transaction')
export class SaleTransactionController {
  constructor(
    private saleTransactionService: SaleTransactionService,
    private fabricNetworkService: FabricNetworkService,
    private fabricNetworkConfigService: FabricNetworkConfigService,
  ) {}

  @Post()
  @ApiOkResponse({
    type: CreateSaleTransactionResponseDto,
  })
  async createTransaction(
    @GetUser() user: User,
    @Body() createDto: CreateSaleTransactionDto,
  ) {
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

      await this.saleTransactionService.createNetworkTransaction(
        contract,
        user,
        createDto,
      );

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

  @ApiOkResponse({
    type: SaleTransactionResponseDto,
  })
  @Get()
  async getTransactions(@GetUser() user: User) {
    return await this.saleTransactionService.getTransactions({
      userId: user.id,
    });
  }
}
