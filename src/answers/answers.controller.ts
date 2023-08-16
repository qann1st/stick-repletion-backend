import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RefType } from 'mongoose';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { User } from 'src/user/user.schema';
import { AnswerService } from './answers.service';
import { CreateAnswerDto } from './dto/createAnswer.dto';
import { UpdateAnswerDto } from './dto/updateAnswer.dto';

@UseGuards(AccessTokenGuard)
@Controller('answers')
export class AnswersController {
  constructor(
    @Inject(AnswerService)
    private readonly answerService: AnswerService,
  ) {}

  @Post()
  createAnswer(
    @CurrentUser() user: User,
    @Body(ValidationPipe) createAnswerDto: CreateAnswerDto,
  ) {
    return this.answerService.createAnswer(user, createAnswerDto);
  }

  @Put('/rating/:id')
  upRating(@CurrentUser() user: User, @Param('id') id: RefType) {
    return this.answerService.likeAnswer(user, id);
  }

  @Delete('/rating/:id')
  downRating(@CurrentUser() user: User, @Param('id') id: RefType) {
    return this.answerService.dislikeAnswer(user, id);
  }

  @Patch(':id')
  updateAnswer(
    @Param('id') id: RefType,
    @Body(ValidationPipe) updateAnswerDto: UpdateAnswerDto,
    @CurrentUser() user: User,
  ) {
    return this.answerService.updateAnswer(id, updateAnswerDto, user);
  }

  @Delete(':id')
  removeAnswer(@CurrentUser() user: User, @Param('id') id: RefType) {
    return this.answerService.removeAnswer(user, id);
  }
}
