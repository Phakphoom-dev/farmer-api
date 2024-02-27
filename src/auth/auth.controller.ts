import { JwtAuthGuard } from './guard/jwt-auth.guard';
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
import { RoleGuard } from './guard/role.guard';
import { Roles } from 'src/common/decorators/role/roles.decorator';
import { RoleEnum } from './enum/role.enum';

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

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  @Post('register-network/:userId')
  async register(@Param('userId', ParseIntPipe) userId) {
    await this.authService.register(userId);

    return { message: 'Register user success' };
  }
}
