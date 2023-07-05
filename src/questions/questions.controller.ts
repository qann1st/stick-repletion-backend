import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { RefType } from 'mongoose';
import { User } from 'src/user/user.schema';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

@UseGuards(AccessTokenGuard)
@Controller('questions')
export class QuestionsController {
  constructor(
    @Inject(QuestionsService)
    private readonly questionsService: QuestionsService,
  ) {}

  @Get()
  getAllQuestions() {
    return this.questionsService.getAllQuestions();
  }

  @Get(':id')
  getQuestionById(@Param('id') id: RefType) {
    return this.questionsService.getQuestionById(id);
  }

  @Post()
  createQuestion(
    @CurrentUser() user: User,
    @Body(ValidationPipe) createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionsService.createQuestion(user, createQuestionDto);
  }

  @Put('/rating/:id')
  upRating(@CurrentUser() user: User, @Param('id') id: RefType) {
    return this.questionsService.upRating(user, id);
  }

  @Delete('/rating/:id')
  downRating(@CurrentUser() user: User, @Param('id') id: RefType) {
    return this.questionsService.downRating(user, id);
  }

  @Patch(':id')
  updateQuestion(
    @Param('id') id: RefType,
    @Body(ValidationPipe) updateQuestionDto: UpdateQuestionDto,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.updateQuestion(id, updateQuestionDto, user);
  }

  @Delete(':id')
  removeQuestion(@CurrentUser() user: User, @Param('id') id: RefType) {
    return this.questionsService.removeQuestion(user, id);
  }
}
