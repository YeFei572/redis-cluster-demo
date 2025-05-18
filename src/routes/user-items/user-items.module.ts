import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserItem, UserItemSchema } from 'src/schemas/user-items.schema';
import { UserItemsController } from './user-items.controller';
import { UserItemsService } from './user-items.service';
import {
  FishPoleStatistics,
  FishPoleStatisticsSchema,
} from 'src/schemas/fish-pole-statistics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserItem.name, schema: UserItemSchema },
    ]),
    MongooseModule.forFeature([
      { name: FishPoleStatistics.name, schema: FishPoleStatisticsSchema },
    ]),
  ],
  controllers: [UserItemsController],
  providers: [UserItemsService],
  exports: [UserItemsService],
})
export class UserItemsModule {}
