import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateSaleTransactionDto } from './dto/create-sale-transaction.dto';
import { GetUser } from '../decorators/user/get-user.decorator';
import type { User } from '@prisma/client';
import { SaleTransactionService } from './sale-transaction.service';

@UseGuards(JwtAuthGuard)
@Controller('sale-transaction')
export class SaleTransactionController {
  constructor(private saleTransactionService: SaleTransactionService) {}

  @Post()
  async createTransaction(
    @GetUser() user: User,
    @Body() createDto: CreateSaleTransactionDto,
  ) {
    return await this.saleTransactionService.createTransaction(user, createDto);
  }

  @Get()
  async getTransactions(@GetUser() user: User) {
    return await this.saleTransactionService.getTransactions({
      userId: user.id,
    });
  }
}
