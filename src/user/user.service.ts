import { Injectable } from '@nestjs/common';
import { type User } from '@prisma/client';
import { RoleEnum } from '../auth/enum/role.enum';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private roleService: RoleService,
  ) {}

  async findUser(params: Partial<UserDto>): Promise<User> {
    return this.prismaService.user.findFirst({
      where: params,
      include: {
        role: true,
      },
    });
  }

  async addUser(userDto: UserDto, role: RoleEnum): Promise<User> {
    const userRole = await this.roleService.findRole({
      rolename: role,
    });

    return this.prismaService.user.create({
      data: {
        ...userDto,
        roleId: userRole.id,
      },
    });
  }
}
