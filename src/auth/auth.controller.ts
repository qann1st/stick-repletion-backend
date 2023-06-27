import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { SignInDto } from './dto/signIn.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  signUp(@Body(ValidationPipe) user: CreateUserDto) {
    return this.authService.signUp(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  signIn(@Body(ValidationPipe) user: SignInDto) {
    return this.authService.signIn(user);
  }
}
