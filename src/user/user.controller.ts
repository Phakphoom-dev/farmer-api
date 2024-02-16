import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoleEnum } from 'src/auth/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/decorators/role/roles.decorator';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('register-farmer')
  async registerFarmer(@Body() userDto: UserDto) {
    return await this.userService.addUser(userDto, RoleEnum.ADMIN);
  }
}
