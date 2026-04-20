import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { HealthStatusGetDto } from './entities/health-status.js';

@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({
    type: HealthStatusGetDto,
  })
  health(): HealthStatusGetDto {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
