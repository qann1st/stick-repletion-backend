import { PartialType } from '@nestjs/mapped-types';
import { CreateAnswerDto } from './createAnswer.dto';

export class UpdateAnswerDto extends PartialType(CreateAnswerDto) {}
