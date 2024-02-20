import { ApiProperty } from '@nestjs/swagger';

export class LoginData {
  @ApiProperty()
  access_token: string;
}

export class LoginResponse {
  @ApiProperty({
    type: LoginData,
  })
  data: LoginData;
}
