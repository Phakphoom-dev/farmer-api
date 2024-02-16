import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Role } from '@prisma/client';

@Injectable()
export class RoleRepository {
  constructor(private prismaService: PrismaService) {}

  async findRole(params: Partial<Role>): Promise<Role> {
    return this.prismaService.role.findFirst({
      where: params,
    });
  }
}
