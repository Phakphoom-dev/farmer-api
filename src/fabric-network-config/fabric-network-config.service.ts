import { Injectable } from '@nestjs/common';
import { envOrDefault } from '../common/helpers';
import * as grpc from '@grpc/grpc-js';
import { promises as fs } from 'fs';

@Injectable()
export class FabricNetworkConfigService {
  public cryptoPath: string;
  public channelName: string;
  public chaincodeName: string;
  public mspId: string;
  public tlsCertPath: string;
  public peerEndpoint: string;
  public peerHostAlias: string;
  public keyDirectoryPath: string;
  public certPath: string;
  public walletPath: string;

  constructor() {
    this.channelName = envOrDefault('CHANNEL_NAME', '');
    this.chaincodeName = envOrDefault('CHAINCODE_NAME', '');
    this.mspId = envOrDefault('MSP_ID', '');
    this.cryptoPath = envOrDefault('CRYPTO_PATH', '');
    this.tlsCertPath = envOrDefault('TLS_CERT_PATH', '');
    this.peerEndpoint = envOrDefault('PEER_ENDPOINT', '');
    this.peerHostAlias = envOrDefault('PEER_HOST_ALIAS', '');
    this.keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', '');
    this.certPath = envOrDefault('CERT_PATH', '');
    this.walletPath = envOrDefault('WALLET_PATH', '');
  }

  public async newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(this.tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(this.peerEndpoint, tlsCredentials, {
      'grpc.ssl_target_name_override': this.peerHostAlias,
    });
  }
}
