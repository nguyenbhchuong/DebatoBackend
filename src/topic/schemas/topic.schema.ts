import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TopicDocument = Topic & Document;

@Schema({ timestamps: true })
export class Topic {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Number, default: 0 })
  support_count: number;

  @Prop({ required: true, type: Number, default: 0 })
  oppose_count: number;

  @Prop({ type: [String] })
  file_links: string[];

  @Prop({ required: true })
  user_id: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
