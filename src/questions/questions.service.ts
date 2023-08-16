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
  ): Promise<{
    questions: QuestionDocument[];
    totalCount: number;
    pages: number;
  }> {
    const questions = await this.questionModel.find({});

    return {
      questions: questions.reverse().slice(limit * (page - 1), limit * page),
      totalCount: questions.length,
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
      questions: questions
        .reverse()
        .slice((page - 1) * limit, page * limit + 1),
      users: users.reverse().slice((page - 1) * limit, page * limit + 1),
      pages: Math.ceil((questions.length + users.length) / limit),
    };
  }

  async getQuestionById(id: RefType): Promise<QuestionDocument> {
    const question = await this.questionModel.findById(id);
    return question;
  }

  async createQuestion(
    user: User,
    createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionDocument> {
    const question = await this.questionModel.create({
      ...createQuestionDto,
      owner: { username: user.username, avatar: user.avatar, _id: user._id },
    });
    await this.userModel.findByIdAndUpdate(user._id, {
      $addToSet: { questions: question },
    });
    return question;
  }

  async likeQuestion(
    user: User,
    id: RefType,
  ): Promise<{ rating: number; likes: string[]; dislikes: string[] }> {
    const question = await this.questionModel.findById(id);
    const hasDislike = question.dislikes.find(
      (el) => el.toString() === user._id.toString(),
    );
    const editQuestion = await this.questionModel.findByIdAndUpdate(
      id,
      {
        [hasDislike ? '$pull' : '$addToSet']: {
          [hasDislike ? 'dislikes' : 'likes']: user._id,
        },
      },
      { new: true },
    );

    return {
      rating: editQuestion.likes.length - editQuestion.dislikes.length,
      likes: editQuestion.likes,
      dislikes: editQuestion.dislikes,
    };
  }

  async dislikeQuestion(
    user: User,
    id: RefType,
  ): Promise<{ rating: number; likes: string[]; dislikes: string[] }> {
    const question = await this.questionModel.findById(id);
    const hasLike = question.likes.find(
      (el) => el.toString() === user._id.toString(),
    );

    const editQuestion = await this.questionModel.findByIdAndUpdate(
      id,
      {
        [hasLike ? '$pull' : '$addToSet']: {
          [hasLike ? 'likes' : 'dislikes']: user._id,
        },
      },
      { new: true },
    );

    return {
      rating: editQuestion.likes.length - editQuestion.dislikes.length,
      likes: editQuestion.likes,
      dislikes: editQuestion.dislikes,
    };
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
