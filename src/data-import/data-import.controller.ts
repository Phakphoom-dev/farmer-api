import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoleEnum } from 'src/auth/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/common/decorators/role/roles.decorator';
import { DataImportService } from './data-import.service';
import { DataImportDto } from './dto/data-import.dto';
import { GetUser } from 'src/common/decorators/user/get-user.decorator';

@Controller('data-import')
@UseGuards(JwtAuthGuard, RoleGuard)
export class DataImportController {
  constructor(private dataImportService: DataImportService) {}

  @Post('import-from-db')
  @Roles(RoleEnum.ADMIN)
  async importFromDb() {
    this.dataImportService.importFromDb();
  }

  @Post('import-from-excel')
  @Roles(RoleEnum.ADMIN)
  async importFromExcel(@Body() dataImportDto: DataImportDto, @GetUser() user) {
    this.dataImportService.importFromExcel(dataImportDto, user);
  }

  @Post('mockup-excel')
  @Roles(RoleEnum.ADMIN)
  async mockupExcel() {
    await this.dataImportService.mockupExcel();

    return {
      message: 'Created excel mockup success',
    };
  }
}
