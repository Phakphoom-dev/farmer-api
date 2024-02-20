import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoleEnum } from '../auth/enum/role.enum';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../decorators/role/roles.decorator';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../decorators/user/get-user.decorator';
import type { User } from '@prisma/client';
import { UserResponse } from './dto/user-response.dto';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({
    type: UserResponse,
    description: 'register farmer response',
  })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  @Post('register-farmer')
  async registerFarmer(@Body() userDto: UserDto) {
    await this.userService.addUser(userDto, RoleEnum.ADMIN);

    return {
      message: 'register farmer success',
    };
  }

  @ApiOkResponse({
    type: UserResponse,
    description: 'update farmer profile response',
  })
  @Roles(RoleEnum.FARMER)
  @Put('update-profile/:id')
  async updateProfile(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id,
    @Body() userDto: UserDto,
  ) {
    const findUser = await this.userService.findUniqueUserById(id);

    if (findUser.id !== user.id) {
      throw new ForbiddenException('You are now allowed to update');
    }

    await this.userService.updateUser(user.id, userDto);

    return {
      message: 'update profile success',
    };
  }
}
