import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prismaService: PrismaService) {}

  async findRole(params: Prisma.RoleWhereInput) {
    return this.prismaService.role.findFirst({
      where: params,
    });
  }
}
