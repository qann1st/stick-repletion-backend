import { IsAlpha, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsAlpha()
  user: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
