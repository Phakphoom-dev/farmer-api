import { Controller, Get } from '@nestjs/common';

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
