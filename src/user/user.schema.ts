import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';
import { Question } from 'src/questions/questions.schema';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class User {
  @Exclude()
  _id: string;
  @Exclude()
  __v: number;
  @Prop({ required: true, minlength: 2, maxlength: 32 })
  username: string;
  @Prop({
    required: true,
    default:
      'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png',
  })
  avatar: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, select: false })
  password: string;
  @Prop({ default: Date.now() })
  createdAccount: Date;
  @Prop()
  questions: Question[];
}

export const UserSchema = SchemaFactory.createForClass(User);
