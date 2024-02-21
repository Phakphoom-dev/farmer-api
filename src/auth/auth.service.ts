import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { verify } from 'argon2';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { buildCCPOrg1, buildWallet } from 'src/common/helpers/wallet';
import {
  buildCAClient,
  enrollAdmin,
  registerAndEnrollUser,
} from 'src/common/helpers/ca-utils';
import { FabricNetworkConfigService } from 'src/fabric-network-config/fabric-network-config.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private fabricNetworkConfigService: FabricNetworkConfigService,
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

  async register(userId: number) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });

    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPOrg1();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(ccp, 'ca.org1.example.com');

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(
      this.fabricNetworkConfigService.walletPath,
    );

    // in a real application this would be done on an administrative flow, and only once
    await enrollAdmin(caClient, wallet, this.fabricNetworkConfigService.mspId);

    // in a real application this would be done only when a new user was required to be added
    // and would be part of an administrative flow
    await registerAndEnrollUser(
      caClient,
      wallet,
      this.fabricNetworkConfigService.mspId,
      user.username,
      'org1.department1',
    );
  }
}
