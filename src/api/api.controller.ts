import { Controller, Get, Query } from '@nestjs/common';
import { VinService } from '@api/services/vin.service';
import { QService } from '@api/services/q.service';

@Controller('api')
export class ApiController {
  constructor(
    private readonly vinService: VinService,
    private readonly qService: QService,
  ) {}

  @Get('vin')
  getVin(@Query('vin') vin: string) {
    return this.vinService.run(vin);
  }

  @Get('q')
  getQ(@Query('q') q: string) {
    return this.qService.run(q);
  }
}
