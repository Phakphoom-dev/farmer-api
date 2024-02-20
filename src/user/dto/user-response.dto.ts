import { ApiProperty } from '@nestjs/swagger';
import { CreatedResponse } from '../../types/swagger';

export class UserData {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;
}

export class UserResponse {
  @ApiProperty({
    type: CreatedResponse,
  })
  data: CreatedResponse;
}
