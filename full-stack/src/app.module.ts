import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZipCodesService } from './zip-codes/zip-codes.service';
import type { RedisClientOptions } from 'redis';

import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ZipCodesService],
})
export class AppModule {}
