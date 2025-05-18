import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FishPoleStatistics } from 'src/schemas/fish-pole-statistics.schema';
import { UserItem } from 'src/schemas/user-items.schema';
import { UserCheckInMap } from './dto/statistics.interface';

@Injectable()
export class UserItemsService {
  constructor(
    @InjectModel(UserItem.name) private userItemModel: Model<UserItem>,
    @InjectModel(FishPoleStatistics.name)
    private fishPoleStatisticsModel: Model<FishPoleStatistics>,
  ) {}
  private readonly fishPoleIds = [
    '67ed7d6902e3ef805398765e',
    '67ed7d6902e3ef805398765f',
    '67ed7d6902e3ef8053987660',
    '67ed7d6902e3ef8053987661',
  ];

  private readonly startTime = 1743609600000;
  private readonly endTime = 1743955199000;

  // 统计领满鱼杆的天数
  async getFishRodDays() {
    const userCheckInStats = await this.fishPoleStatisticsModel.aggregate([
      {
        $group: {
          _id: '$address',
          uniqueDates: { $addToSet: '$date' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          address: '$_id',
          checkInDays: { $size: '$uniqueDates' },
          _id: 0,
        },
      },
      {
        $sort: { checkInDays: 1 },
      },
    ]);
    // 初始化结果map
    const result: UserCheckInMap = {
      oneDayUsers: [],
      twoDaysUsers: [],
      threeDaysUsers: [],
      fourDaysUsers: [],
    };
    // 将用户分类到对应的签到天数组
    for (const user of userCheckInStats) {
      const { address, checkInDays } = user;

      // 只统计1-4天的用户，且只放入最高的天数分类中
      if (checkInDays === 1) {
        result.oneDayUsers.push(address);
      } else if (checkInDays === 2) {
        result.twoDaysUsers.push(address);
      } else if (checkInDays === 3) {
        result.threeDaysUsers.push(address);
      } else if (checkInDays === 4) {
        result.fourDaysUsers.push(address);
      }
    }
    return result;
  }

  async getDailyFishRodData() {
    // 4月3日0点-4月4日0点，把时间戳换成日期
    const firstDayStartTime = new Date('2025-04-03 00:00:00');
    const firstDayEndTime = new Date('2025-04-04 00:00:00');
    // 4月4日0点-4月5日0点
    const secondDayStartTime = new Date('2025-04-04 00:00:00');
    const secondDayEndTime = new Date('2025-04-05 00:00:00');
    // 4月5日0点-4月6日0点
    const thirdDayStartTime = new Date('2025-04-05 00:00:00');
    const thirdDayEndTime = new Date('2025-04-06 00:00:00');
    // 4月6日0点-4月7日0点
    const fourthDayStartTime = new Date('2025-04-06 00:00:00');
    const fourthDayEndTime = new Date('2025-04-07 00:00:00');

    // 开始处理第一天的数据: 查询条件为开始时间，结束时间，itemId在fishPoleIds中，每个用户的记录有5条，查处所有符合用户的信息（分组）
    const firstDayData = await this.userItemModel.aggregate([
      {
        $match: {
          createdAt: { $gte: firstDayStartTime, $lte: firstDayEndTime },
          itemId: { $in: this.fishPoleIds },
        },
      },
      { $group: { _id: '$address', count: { $sum: 1 } } },
      { $match: { count: { $gte: 5 } } },
    ]);
    const firstDayDataList = firstDayData.map((item) => {
      return {
        address: item._id,
        date: '2025-04-03',
      };
    });
    await this.fishPoleStatisticsModel.create(firstDayDataList);

    // 开始处理第二天的数据

    const secondDayData = await this.userItemModel.aggregate([
      {
        $match: {
          createdAt: { $gte: secondDayStartTime, $lte: secondDayEndTime },
          itemId: { $in: this.fishPoleIds },
        },
      },
      { $group: { _id: '$address', count: { $sum: 1 } } },
      { $match: { count: { $gte: 5 } } },
    ]);
    const secondDayDataList = secondDayData.map((item) => {
      return {
        address: item._id,
        date: '2025-04-04',
      };
    });
    await this.fishPoleStatisticsModel.create(secondDayDataList);

    // 开始处理第三天的数据

    const thirdDayData = await this.userItemModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirdDayStartTime, $lte: thirdDayEndTime },
          itemId: { $in: this.fishPoleIds },
        },
      },
      { $group: { _id: '$address', count: { $sum: 1 } } },
      { $match: { count: { $gte: 5 } } },
    ]);
    const thirdDayDataList = thirdDayData.map((item) => {
      return {
        address: item._id,
        date: '2025-04-05',
      };
    });
    await this.fishPoleStatisticsModel.create(thirdDayDataList);

    // 开始处理第四天的数据

    const fourthDayData = await this.userItemModel.aggregate([
      {
        $match: {
          createdAt: { $gte: fourthDayStartTime, $lte: fourthDayEndTime },
          itemId: { $in: this.fishPoleIds },
        },
      },
      { $group: { _id: '$address', count: { $sum: 1 } } },
      { $match: { count: { $gte: 5 } } },
    ]);
    const fourthDayDataList = fourthDayData.map((item) => {
      return {
        address: item._id,
        date: '2025-04-06',
      };
    });
    await this.fishPoleStatisticsModel.create(fourthDayDataList);
  }
}
