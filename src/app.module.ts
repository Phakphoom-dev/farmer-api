import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/role.module';
import { SaleTransactionModule } from './sale-transaction/sale-transaction.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DataImportModule } from './data-import/data-import.module';
import { FabricNetworkModule } from './fabric-network/fabric-network.module';
import { FabricNetworkConfigModule } from './fabric-network-config/fabric-network-config.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    RoleModule,
    SaleTransactionModule,
    DataImportModule,
    FabricNetworkModule,
    FabricNetworkConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
