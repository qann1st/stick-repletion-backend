import { IsAlpha, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsAlpha()
  username: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
