import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RefType } from 'mongoose';
import { Question, QuestionDocument } from 'src/questions/questions.schema';
import { User, UserDocument } from 'src/user/user.schema';
import { Answer, AnswerDocument } from './answers.schema';
import { CreateAnswerDto } from './dto/createAnswer.dto';
import { UpdateAnswerDto } from './dto/updateAnswer.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(Answer.name)
    private answerModel: Model<AnswerDocument>,
  ) {}

  async createAnswer(
    user: User,
    createAnswerDto: CreateAnswerDto,
  ): Promise<AnswerDocument> {
    const answer = await this.answerModel.create({
      ...createAnswerDto,
      owner: user,
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      $addToSet: { answers: answer },
    });
    await this.questionModel.findByIdAndUpdate(createAnswerDto._id, {
      $addToSet: { answers: answer },
    });

    return answer;
  }

  async upRating(user: User, id: RefType): Promise<QuestionDocument> {
    return await this.answerModel.findByIdAndUpdate(id, {
      $addToSet: { rating: user },
      new: true,
    });
  }

  async downRating(user: User, id: RefType): Promise<QuestionDocument> {
    return await this.answerModel.findByIdAndUpdate(id, {
      $pull: { rating: user },
      new: true,
    });
  }

  async updateAnswer(
    id: RefType,
    updateAnswerDto: UpdateAnswerDto,
    user: User,
  ): Promise<AnswerDocument> {
    const answer = await this.answerModel.findByIdAndUpdate(
      id,
      updateAnswerDto,
    );

    if (!answer) {
      throw new NotFoundException('Такого ответа не существует');
    }

    if (user._id.toString() === answer.owner[0]._id.toString()) {
      return answer.updateOne(updateAnswerDto, { new: true });
    } else {
      throw new ForbiddenException('Вы не являетесь владельцем ответа');
    }
  }

  async removeAnswer(user: User, id: RefType): Promise<AnswerDocument> {
    const answer = await this.answerModel.findById(id);

    if (!answer) {
      throw new NotFoundException('Такого вопроса не существует');
    }

    if (user._id.toString() === answer.owner[0]._id.toString()) {
      await this.userModel.findByIdAndUpdate(user._id, {
        $pull: { answers: answer },
      });

      return answer.deleteOne();
    } else {
      throw new ForbiddenException('Вы не являетесь владельцем вопроса');
    }
  }
}
