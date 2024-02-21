import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { Column, Workbook } from 'exceljs';
import { capitalizeFirstLetter } from '../common/helpers';
import type { GoodAgriculturalPractice, User } from '@prisma/client';
import { FabricNetworkService } from '../fabric-network/fabric-network.service';
import { DataImportDto } from './dto/data-import.dto';
import { FabricNetworkConfigService } from 'src/fabric-network-config/fabric-network-config.service';

@Injectable()
export class DataImportService {
  private filename: string;
  constructor(
    private prismaService: PrismaService,
    private fabricNetworkService: FabricNetworkService,
    private fabricNetworkConfigService: FabricNetworkConfigService,
  ) {
    this.filename = 'excel-example.xlsx';
  }

  async importFromDb() {
    const users = await this.prismaService.user.findMany();
    const gap = await this.prismaService.goodAgriculturalPractice.findMany();
    const gmp = await this.prismaService.goodManufacturingPractice.findMany();
  }

  async importFromExcel(dataImportDto: DataImportDto, user: User) {
    this.fabricNetworkService.displayInputParameters();

    const { client, gateway } =
      await this.fabricNetworkService.connectNetwork(user);

    try {
      const network = gateway.getNetwork(
        this.fabricNetworkConfigService.channelName,
      );

      // Get the smart contract from the network.
      const contract = network.getContract(
        this.fabricNetworkConfigService.chaincodeName,
      );

      const workbook = new Workbook();

      workbook.xlsx.readFile(this.filename).then(() => {
        const userSheet = workbook.getWorksheet('users');
      });
    } catch (e) {
      throw new BadRequestException(e.details);
    } finally {
      gateway.close();
      client.close();
    }
  }

  async mockupExcel(): Promise<void> {
    if (!fs.existsSync(this.filename)) {
      const workbook = new Workbook();

      await this.prepareUserSheet(workbook);
      await this.prepareGapSheet(workbook);
      await this.prepareGmpSheet(workbook);

      await workbook.xlsx.writeFile(this.filename);
    } else {
      throw new ConflictException('File already created');
    }
  }

  async prepareGmpSheet(workbook: Workbook) {
    const worksheet = workbook.addWorksheet('gmp');
    const userWorksheetColumn: Partial<Column>[] = [];

    const gmp = await this.prismaService.goodManufacturingPractice.findMany();

    if (gmp.length > 0) {
      Object.keys(gmp[0]).forEach((key) => {
        userWorksheetColumn.push({
          header: capitalizeFirstLetter(key),
          key,
        });
      });

      worksheet.columns = userWorksheetColumn;

      gmp.forEach((gmp: GoodAgriculturalPractice) => {
        worksheet.addRow(gmp);
      });
    }
  }

  async prepareGapSheet(workbook: Workbook) {
    const worksheet = workbook.addWorksheet('gap');
    const userWorksheetColumn: Partial<Column>[] = [];

    const gap = await this.prismaService.goodAgriculturalPractice.findMany();

    if (gap.length > 0) {
      Object.keys(gap[0]).forEach((key) => {
        userWorksheetColumn.push({
          header: capitalizeFirstLetter(key),
          key,
        });
      });

      worksheet.columns = userWorksheetColumn;

      gap.forEach((gap: GoodAgriculturalPractice) => {
        worksheet.addRow(gap);
      });
    }
  }

  async prepareUserSheet(workbook: Workbook) {
    const worksheet = workbook.addWorksheet('users');
    const userWorksheetColumn: Partial<Column>[] = [];

    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        password: true,
        firstname: true,
        lastname: true,
      },
    });

    if (users.length > 0) {
      Object.keys(users[0]).forEach((key) => {
        userWorksheetColumn.push({
          header: capitalizeFirstLetter(key),
          key,
        });
      });

      worksheet.columns = userWorksheetColumn;

      users.forEach((user: User) => {
        worksheet.addRow(user);
      });
    }
  }
}
