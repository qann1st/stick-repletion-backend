import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionDocument } from './questions.schema';
import { Model, RefType } from 'mongoose';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { User, UserDocument } from 'src/user/user.schema';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getQuestions(
    page: number,
    limit: number,
  ): Promise<{ questions: QuestionDocument[]; pages: number }> {
    const questions = await this.questionModel.find({});
    return {
      questions: questions.slice((page - 1) * limit).reverse(),
      pages: Math.ceil(questions.length / limit),
    };
  }

  async getSearch(
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    questions: QuestionDocument[];
    users: UserDocument[];
    pages: number;
  }> {
    const questions = await this.questionModel.find({
      title: { $regex: `^${search}` },
    });
    const users = await this.userModel.find({
      username: { $regex: `.*${search}.*` },
    });

    return {
      questions: questions.slice((page - 1) * limit).reverse(),
      users: users.slice((page - 1) * limit).reverse(),
      pages: Math.ceil((questions.length + users.length) / limit),
    };
  }

  async getQuestionById(id: RefType): Promise<QuestionDocument> {
    return await this.questionModel.findById(id);
  }

  async createQuestion(
    user: User,
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

  async upRating(user: User, id: RefType): Promise<QuestionDocument> {
    return await this.questionModel.findByIdAndUpdate(id, {
      $addToSet: { rating: user },
      new: true,
    });
  }

  async downRating(user: User, id: RefType): Promise<QuestionDocument> {
    return await this.questionModel.findByIdAndUpdate(id, {
      $pull: { rating: user },
      new: true,
    });
  }

  async updateQuestion(
    id: RefType,
    updateQuestionDto: UpdateQuestionDto,
    user: User,
  ): Promise<QuestionDocument> {
    const question = await this.questionModel.findByIdAndUpdate(
      id,
      updateQuestionDto,
    );

    if (!question) {
      throw new NotFoundException('Такого вопроса не существует');
    }

    if (user._id.toString() === question.owner[0]._id.toString()) {
      return question.updateOne(updateQuestionDto, { new: true });
    } else {
      throw new ForbiddenException('Вы не являетесь владельцем вопроса');
    }
  }

  async removeQuestion(user: User, id: RefType): Promise<QuestionDocument> {
    const question = await this.questionModel.findById(id);

    if (!question) {
      throw new NotFoundException('Такого вопроса не существует');
    }

    if (user._id.toString() === question.owner[0]._id.toString()) {
      await this.userModel.findByIdAndUpdate(user._id, {
        $pull: { questions: question },
      });

      return question.deleteOne();
    } else {
      throw new ForbiddenException('Вы не являетесь владельцем вопроса');
    }
  }
}
