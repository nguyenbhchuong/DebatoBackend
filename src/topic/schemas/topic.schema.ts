import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TopicDocument = Topic & Document;

@Schema()
export class Topic {
  @Prop({ required: true })
  id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  file_links: string[];

  @Prop({ required: true })
  user_id: Types.ObjectId;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
