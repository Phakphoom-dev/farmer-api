import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSaleTransactionDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
