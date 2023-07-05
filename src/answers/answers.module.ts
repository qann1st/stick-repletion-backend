import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';
import { AnswersController } from './answers.controller';
import { AnswerService } from './answers.service';
import { Answer, AnswerSchema } from './answers.schema';
import { Question, QuestionSchema } from 'src/questions/questions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: UserSchema, name: User.name },
      { schema: AnswerSchema, name: Answer.name },
      { schema: QuestionSchema, name: Question.name },
    ]),
  ],
  controllers: [AnswersController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
