import { Injectable } from '@nestjs/common';
import { Prisma, type User } from '@prisma/client';
import { RoleEnum } from '../auth/enum/role.enum';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { RoleService } from '../role/role.service';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private roleService: RoleService,
  ) {}

  async findUser(params: Prisma.UserWhereInput): Promise<User> {
    return this.prismaService.user.findFirst({
      where: { ...params },
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
        password: await argon.hash(userDto.password),
        roleId: userRole.id,
      },
    });
  }

  async findUniqueUserById(id: number): Promise<User> {
    return this.prismaService.user.findUniqueOrThrow({
      where: { id },
      include: {
        role: true,
      },
    });
  }

  async updateUser(id: number, params: Prisma.UserUpdateInput): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...params,
        password: await argon.hash(params.password as string),
      },
    });
  }
}
