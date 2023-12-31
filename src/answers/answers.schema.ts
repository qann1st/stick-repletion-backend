import { PartialType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document, Types } from 'mongoose';
import { QuestionUser } from 'src/questions/questions.schema';
import { User } from 'src/user/user.schema';

export type AnswerDocument = Answer & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Answer {
  @Exclude()
  _id: string;
  @Exclude()
  __v: number;
  @Prop({
    type: PartialType(User),
  })
  owner: QuestionUser;
  @Prop({ required: true, minlength: 20 })
  answer: string;
  @Prop({ default: [], type: Types.ObjectId, ref: 'User' })
  likes: string[];
  @Prop({ default: [], type: Types.ObjectId, ref: 'User' })
  dislikes: string[];
  @Prop({ default: Date.now() })
  createTimestamp: Date;
  @Prop()
  updateTimestamp: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
