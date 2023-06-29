import { PartialType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/user.schema';

export type QuestionDocument = Question & Document;
type QuestionUser = Pick<
  User,
  '_id' | 'avatar' | 'createdAccount' | 'email' | 'questions' | 'username'
>;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Question {
  @Exclude()
  _id: string;
  @Exclude()
  __v: number;
  @Prop({
    type: PartialType(User),
  })
  owner: QuestionUser;
  @Prop({ required: true, minlength: 2, maxlength: 32 })
  title: string;
  @Prop({ required: true, minlength: 20 })
  problem: string;
  @Prop({ required: true, minlength: 20 })
  attemptsFix: string;
  @Prop({ required: true })
  rating: User[];
  @Prop({ required: true })
  tags: string[];
  @Prop({ default: Date.now() })
  createTimestamp: Date;
  @Prop()
  updateTimestamp: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
