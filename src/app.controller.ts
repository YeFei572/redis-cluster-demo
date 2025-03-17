import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @Get('test')
  getHello(): any {
    this.redisService.set('test', 'test');
    return this.redisService.get('test');
  }
}
