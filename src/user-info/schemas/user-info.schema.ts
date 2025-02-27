import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserInfoDocument = UserInfo & Document;

@Schema()
export class UserInfo {
  @Prop({ type: Types.ObjectId, required: true, unique: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true, unique: true })
  idName: string;

  @Prop({ default: 0 })
  credit: number;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
