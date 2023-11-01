import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
  },
})
export class User extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, select: false })
  password: string;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
