import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false }) // Optional for Google OAuth users
  password?: string;

  @Prop({ required: false })
  googleId?: string;

  @Prop({ required: false })
  displayName?: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];

  _id: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
