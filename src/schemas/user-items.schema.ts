import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserItem extends Document {
    // 用户钱包地址
    @Prop({ required: true })
    address: string;

    // 物品id
    @Prop({ required: true })
    itemId: string;

    // 是否可以堆叠
    @Prop({ default: true })
    canStack: boolean;

    // 是否已装备
    @Prop({ default: false })
    isEquipped: boolean;

    // 冗余字段，装备部位, 如果不是装备，则该字段为空
    @Prop({ required: false })
    equipmentSlot: string;

    // 当前耐久度
    @Prop({ default: 100 })
    currentDurability?: number;

    // 是否删除，默认不删除
    @Prop({ default: false })
    isDeleted: boolean;

    // 获取时间
    @Prop({ default: Date.now })
    createdAt: Date;
}

export type UserItemDocument = UserItem & Document;
export const UserItemSchema = SchemaFactory.createForClass(UserItem);

// 用户地址创建普通索引
UserItemSchema.index({ address: 1 });
// 物品id创建普通索引
UserItemSchema.index({ itemId: 1 });
