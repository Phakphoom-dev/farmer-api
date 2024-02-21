import { Injectable, NotFoundException } from '@nestjs/common';
import { FabricNetworkConfigService } from '../fabric-network-config/fabric-network-config.service';
import {
  Contract,
  Gateway,
  connect,
  signers,
} from '@hyperledger/fabric-gateway';
import * as grpc from '@grpc/grpc-js';
import { promises as fs } from 'fs';
import * as crypto from 'crypto';
import { Wallets, X509Identity } from 'fabric-network';

@Injectable()
export class FabricNetworkService {
  constructor(private networkConfigService: FabricNetworkConfigService) {}

  public async displayInputParameters(): Promise<void> {
    console.log(`channelName:       ${this.networkConfigService.channelName}`);
    console.log(
      `chaincodeName:     ${this.networkConfigService.chaincodeName}`,
    );
    console.log(`mspId:             ${this.networkConfigService.mspId}`);
    console.log(`cryptoPath:        ${this.networkConfigService.cryptoPath}`);
    console.log(
      `keyDirectoryPath:  ${this.networkConfigService.keyDirectoryPath}`,
    );
    console.log(`certPath:          ${this.networkConfigService.certPath}`);
    console.log(`tlsCertPath:       ${this.networkConfigService.tlsCertPath}`);
    console.log(`peerEndpoint:      ${this.networkConfigService.peerEndpoint}`);
    console.log(
      `peerHostAlias:     ${this.networkConfigService.peerHostAlias}`,
    );
    console.log(`walletPath:     ${this.networkConfigService.walletPath}`);
  }

  /**
   * Submit a transaction synchronously, blocking until it has been committed to the ledger.
   */
  async createAsset(contract: Contract, user: any): Promise<void> {
    const { id, firstname, lastname, username } = user;

    console.log(
      '\n--> Submit Transaction: CreateAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments',
    );

    await contract.submitTransaction(
      'CreateAsset',
      id,
      firstname,
      lastname,
      username,
    );

    console.log('*** Transaction committed successfully');
  }

  public async newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(
      this.networkConfigService.tlsCertPath,
    );
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(
      this.networkConfigService.peerEndpoint,
      tlsCredentials,
      {
        'grpc.ssl_target_name_override':
          this.networkConfigService.peerHostAlias,
      },
    );
  }

  async connectNetwork(
    user: any,
  ): Promise<{ gateway: Gateway; client: grpc.Client }> {
    // The gRPC client connection should be shared by all Gateway connections to this endpoint.
    const client: grpc.Client = await this.newGrpcConnection();

    const gateway: Gateway = await connect({
      client,
      identity: await this.newIdentity(user),
      signer: await this.newSigner(user),
      // Default timeouts for different gRPC calls
      evaluateOptions: () => {
        return { deadline: Date.now() + 5000 }; // 5 seconds
      },
      endorseOptions: () => {
        return { deadline: Date.now() + 15000 }; // 15 seconds
      },
      submitOptions: () => {
        return { deadline: Date.now() + 5000 }; // 5 seconds
      },
      commitStatusOptions: () => {
        return { deadline: Date.now() + 60000 }; // 1 minute
      },
    });

    return { client, gateway };
  }

  private async newSigner(user: any): Promise<any> {
    const wallet = await Wallets.newFileSystemWallet(
      this.networkConfigService.walletPath,
    );

    const userIdentity = await wallet.get(user.username);

    if (!userIdentity) {
      throw new NotFoundException('User Identity not found');
    }

    const privateKey = crypto.createPrivateKey(
      (userIdentity as X509Identity).credentials.privateKey,
    );

    return signers.newPrivateKeySigner(privateKey);
  }

  private async newIdentity(user: any): Promise<any> {
    const wallet = await Wallets.newFileSystemWallet(
      this.networkConfigService.walletPath,
    );

    const userIdentity = await wallet.get(user.username);

    if (!userIdentity) {
      throw new NotFoundException('User Identity not found');
    }

    const certificate = (userIdentity as X509Identity).credentials.certificate;

    return {
      mspId: userIdentity.mspId,
      credentials: new TextEncoder().encode(certificate),
    };
  }

  /**
   * This type of transaction would typically only be run once by an application the first time it was started after its
   * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
   */
  async initLedger(contract: Contract): Promise<void> {
    console.log(
      '\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger',
    );

    await contract.submitTransaction('InitLedger');

    console.log('*** Transaction committed successfully');
  }
}
