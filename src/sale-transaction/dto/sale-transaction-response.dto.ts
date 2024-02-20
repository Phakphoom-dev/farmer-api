import { ApiProperty } from '@nestjs/swagger';

export class SaleTransactionData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  userId: number;
}

export class SaleTransactionResponseDto {
  @ApiProperty({
    type: [SaleTransactionData],
    description: 'get sale transactions response',
  })
  data: SaleTransactionData;
}

export class CreateSaleTransactionResponseDto {
  @ApiProperty({
    type: SaleTransactionData,
    description: 'create sale transactions response',
  })
  data: SaleTransactionData;
}
