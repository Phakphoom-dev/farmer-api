import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { verify } from 'argon2';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(username: string, password: string): Promise<User> {
    const user: User = await this.userService.findUser({
      username: username,
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatched = await verify(user.password, password);

    if (!pwMatched) throw new ForbiddenException('Credentials incorrect');

    delete user.password;

    return user;
  }

  async login(user: User) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
