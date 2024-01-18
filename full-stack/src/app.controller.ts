import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ZipCode, ZipCodesService } from './zip-codes/zip-codes.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly zips: ZipCodesService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('zips')
  getZips(
    @Query('text')
    text: string,
    @Query('radius')
    radius: string,
    @Query('long')
    long: string,
    @Query('lat')
    lat: string,
  ): Promise<ZipCode[]> {
    return this.zips.near(
      parseInt(radius, 10),
      [parseInt(long, 10), parseInt(lat, 10)],
      { city: { $regex: text, $options: 'i' } },
    );
  }
}
