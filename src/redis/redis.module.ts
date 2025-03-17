import { Module } from '@nestjs/common';
// import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule } from '@nestjs/config';
import redisConfig from 'src/config/redis.config';
import { RedisClusterService } from './redis-cluster.service';

@Module({
  imports: [
    // NestRedisModule.forRootAsync({
    //   useFactory: () => ({
    //     type: 'cluster',
    //     nodes: [
    //       {
    //         host: process.env.REDIS_HOST,
    //         port: parseInt(process.env.REDIS_PORT),
    //         password: process.env.REDIS_PASSWORD,
    //         db: 0,
    //       }
    //     ]
    //   })
    // })
    ConfigModule.forFeature(redisConfig)
  ],
  providers: [RedisClusterService],
  exports: [RedisClusterService],
})
export class RedisModule { }

export enum RedisEnv {
  GAME = 'game',
  AVATAR = 'avatar',
}
