import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, RefType } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(createUserDto);
  }

  async getUsers(): Promise<UserDocument[]> {
    return await this.userModel.find({});
  }

  async getUserById(id: RefType): Promise<UserDocument> {
    return await this.userModel.findById(id);
  }

  async getUserByName(username: string): Promise<UserDocument> {
    return await this.userModel.findOne({ username });
  }

  async updateUser(id: RefType, update: UpdateUserDto): Promise<UserDocument> {
    return await this.userModel.findByIdAndUpdate(id, update, { new: true });
  }

  async removeUser(id: RefType): Promise<UserDocument> {
    return await this.userModel.findByIdAndDelete(id);
  }
}
