import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReactionDocument = Reaction & Document;

@Schema()
export class Reaction {
  @Prop({ required: true, type: Types.ObjectId })
  user_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  topic_id: Types.ObjectId;

  @Prop({ required: true, type: Number, enum: [1, 2] })
  type: number; // 1 for support, 2 for oppose
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
// Add compound unique index to prevent multiple reactions from same user on same topic
ReactionSchema.index({ user_id: 1, topic_id: 1 }, { unique: true });
