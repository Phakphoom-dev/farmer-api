import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import type { Role } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async findRole(params: Role) {
    return this.roleRepository.findRole(params);
  }
}
