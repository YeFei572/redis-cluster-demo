import { Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';

@Module({
  imports: [
    NestRedisModule.forRootAsync({
      useFactory: () => ({
        type: 'cluster',
        nodes: [
          {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
            password: process.env.REDIS_PASSWORD,
            db: 0,
          }
        ]
      })
    })
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule { }

export enum RedisEnv {
  GAME = 'game',
  AVATAR = 'avatar',
}
