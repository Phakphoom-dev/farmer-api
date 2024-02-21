import {
  Request,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponse } from './dto/auth-response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({
    type: LoginResponse,
    description: 'login response',
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register/:userId')
  async register(@Param('userId', ParseIntPipe) userId) {
    await this.authService.register(userId);

    return { message: 'Register user success' };
  }
}
