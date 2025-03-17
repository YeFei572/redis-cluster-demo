import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis-cluster.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) { }

  @Get('test')
  getHello(): any {
    for (let i = 0; i < 100; i++) {
      this.redisService.set('test' + i, i.toString());
    }
    return this.redisService.get('test');
  }
}
