import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class FishPoleStatistics extends Document {
    // 用户钱包地址
    @Prop({ required: true })
    address: string;

    // 日期，格式为YYYY-MM-DD
    @Prop({ required: true })
    date: string;
}

export type FishPoleStatisticsDocument = FishPoleStatistics & Document;
export const FishPoleStatisticsSchema = SchemaFactory.createForClass(FishPoleStatistics);

