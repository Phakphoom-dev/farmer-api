import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './stretegy/local.stretegy';
import { JwtStrategy } from './stretegy/jwt.stretegy';
import { ConfigModule } from '@nestjs/config';
import { FabricNetworkConfigService } from '../fabric-network-config/fabric-network-config.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PrismaService,
    FabricNetworkConfigService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
