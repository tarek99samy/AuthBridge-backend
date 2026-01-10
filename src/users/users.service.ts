import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
    try {
      return await this.userModel.find();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    try {
      const newUser = new this.userModel(userData);
      return await newUser.save();
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async updateByEmail(email: string, updateData: Partial<User>): Promise<User> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate({ email }, updateData, { new: true });
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const result = await this.userModel.findByIdAndDelete(id);
      if (!result) {
        throw new NotFoundException('User not found');
      }
      return 'User deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
