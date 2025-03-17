import { Controller, Get, Logger } from '@nestjs/common';
import { RedisClusterService } from './redis/redis-cluster.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly redisClusterService: RedisClusterService,
  ) { }

  @Get('test')
  getHello(): any {
    for (let i = 0; i < 100; i++) {
      this.redisClusterService.set('test' + i, i.toString());
    }
    return this.redisClusterService.get('test');
  }
}
