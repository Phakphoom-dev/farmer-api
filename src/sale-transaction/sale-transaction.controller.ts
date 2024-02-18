import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateSaleTransactionDto } from './dto/create-sale-transaction.dto';
import { GetUser } from 'src/decorators/user/get-user.decorator';
import type { User } from '@prisma/client';
import { SaleTransactionService } from './sale-transaction.service';

@UseGuards(JwtAuthGuard)
@Controller('sale-transaction')
export class SaleTransactionController {
  constructor(private saleTransactionService: SaleTransactionService) {}

  @Post('')
  async registerFarmer(
    @GetUser() user: User,
    @Body() createDto: CreateSaleTransactionDto,
  ) {
    return this.saleTransactionService.createTransaction(user, createDto);
  }
}
