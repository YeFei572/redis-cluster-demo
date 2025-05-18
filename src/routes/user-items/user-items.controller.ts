import { Controller, Get } from '@nestjs/common';
import { UserItemsService } from './user-items.service';

@Controller('user-items')
export class UserItemsController {
  constructor(private readonly userItemsService: UserItemsService) { }

  // 统计每天用户领满鱼杆的数据
  @Get('daily-fish-rod-data')
  async getDailyFishRodData() {
    return this.userItemsService.getDailyFishRodData();
  }

  // 统计领满鱼杆的天数
  @Get('fish-rod-days')
  async getFishRodDays() {
    return this.userItemsService.getFishRodDays();
  }
}
