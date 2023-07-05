import { IsHexadecimal, IsString, Length } from 'class-validator';
import { RefType } from 'mongoose';

export class CreateAnswerDto {
  @IsString()
  answer: string;
  @IsHexadecimal()
  @Length(24)
  _id: RefType;
}
