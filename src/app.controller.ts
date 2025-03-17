import { Controller, Get, Logger } from '@nestjs/common';
import { RedisClusterService } from './redis/redis-cluster.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly redisClusterService: RedisClusterService,
  ) { }

  @Get('test')
  async getHello(): Promise<any> {
    const keys = [];
    for (let i = 0; i < 100; i++) {
      keys.push('test' + i);
      await this.redisClusterService.set('test' + i, i.toString());
    }
    const result = await this.redisClusterService.mget(keys);
    return result;
  }
}
