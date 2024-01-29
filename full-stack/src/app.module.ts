import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZipCodesService } from './zip-codes/zip-codes.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ZipCodesService],
})
export class AppModule {}
