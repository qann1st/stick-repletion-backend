import { IsAlphanumeric, IsArray, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsAlphanumeric()
  title: string;
  @IsString()
  problem: string;
  @IsString()
  attemptsFix: string;
  @IsArray()
  tags: string[];
}
