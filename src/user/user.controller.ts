import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { User } from './user.schema';
import { RefType } from 'mongoose';
import { UpdateUserDto } from './dto/updateUser.dto';

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('/me')
  getUserMe(@CurrentUser() user: User) {
    return user;
  }

  @Get(':id')
  getUserById(@Param('id') id: RefType) {
    return this.userService.getUserById(id);
  }

  @Patch('/me')
  updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @CurrentUser() id: RefType,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
