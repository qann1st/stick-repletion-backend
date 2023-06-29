import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionDocument } from './questions.schema';
import { Model, RefType } from 'mongoose';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { User, UserDocument } from 'src/user/user.schema';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getAllQuestions(): Promise<QuestionDocument[]> {
    return await this.questionModel.find({});
  }

  async getQuestionById(id: RefType): Promise<QuestionDocument> {
    return await this.questionModel.findById(id);
  }

  async createQuestion(
    @CurrentUser() user: User,
    createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionDocument> {
    const question = await this.questionModel.create({
      ...createQuestionDto,
      owner: user,
    });
    await this.userModel.findByIdAndUpdate(user._id, {
      $addToSet: { questions: question },
    });
    return question;
  }

  async upRating(
    @CurrentUser() user: User,
    id: RefType,
  ): Promise<QuestionDocument> {
    return await this.questionModel.findByIdAndUpdate(id, {
      $addToSet: { rating: user },
    });
  }

  async downRating(
    @CurrentUser() user: User,
    id: RefType,
  ): Promise<QuestionDocument> {
    return await this.questionModel.findByIdAndUpdate(id, {
      $pull: { rating: user },
    });
  }

  async updateQuestion(
    id: RefType,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionDocument> {
    return await this.questionModel.findByIdAndUpdate(id, updateQuestionDto);
  }

  async removeQuestion(id: RefType): Promise<QuestionDocument> {
    return await this.questionModel.findByIdAndDelete(id);
  }
}
