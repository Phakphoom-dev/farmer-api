import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor() {}

  @Get('health-check')
  async getHealth(): Promise<any> {
    return {
      status: `${new Date().toLocaleString()}: [App Controller] Initializing check application health function.`,
    };
  }
}
