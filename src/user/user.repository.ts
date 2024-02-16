import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { User, Role } from '@prisma/client';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findUser(params: Partial<User>): Promise<User> {
    return this.prismaService.user.findFirst({
      where: params,
      include: {
        role: true,
      },
    });
  }

  async createUser(params: UserDto, role: Role): Promise<User> {
    return this.prismaService.user.create({
      data: {
        ...params,
        roleId: role.id,
      },
    });
  }
}
