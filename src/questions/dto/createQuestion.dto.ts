import { IsArray, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  title: string;
  @IsString()
  problem: string;
  @IsString()
  attemptsFix: string;
  @IsArray()
  tags: string[];
}
