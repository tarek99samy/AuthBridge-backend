import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    const result = await newUser.save();
    return result;
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }

  async updateByEmail(email: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate({ email }, updateData, { new: true });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }
}
