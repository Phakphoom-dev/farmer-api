import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DataImportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  filePath: string;
}
