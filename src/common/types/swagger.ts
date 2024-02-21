import { ApiProperty } from '@nestjs/swagger';

export class CreatedResponse {
  @ApiProperty()
  message: string;
}
