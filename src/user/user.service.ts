import { RoleEnum } from '../auth/enum/role.enum';
import { Injectable } from '@nestjs/common';
import { type User } from '@prisma/client';
import { UserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { RoleRepository } from 'src/role/role.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
  ) {}

  async findUser(params: Partial<UserDto>): Promise<User> {
    return this.userRepository.findUser(params);
  }

  async addUser(userDto: UserDto, role: RoleEnum): Promise<User> {
    const userRole = await this.roleRepository.findRole({ rolename: role });

    return this.userRepository.createUser(userDto, userRole);
  }
}
