import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const userExists = await this.userService.getUserByEmail(
      createUserDto.email,
    );
    if (userExists) {
      throw new BadRequestException('Пользователь уже зарегистрирован');
    }

    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.userService.createUser({
      ...createUserDto,
      password: hash,
    });

    const payload = {
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
    };

    return await this.getAccessToken(payload);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.getUserByEmail(signInDto.email);
    if (!user) throw new BadRequestException('Неверная почта или пароль');

    const passwordMatches = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Неверная почта или пароль');
    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username,
    };

    return await this.getAccessToken(payload);
  }

  async hashData(data: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(data, salt);
  }

  async getAccessToken(payload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES') || '15d',
    });
    return { accessToken };
  }
}
