import { Prop, Schema } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import mongoose from 'mongoose';
import { User } from 'src/user/user.schema';

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Auth {
  @Exclude()
  _id: string;
  @Exclude()
  __v: number;
  @Type(() => User)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true })
  user: User;
}
