import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserException, UserFetchException } from 'src/common/exceptions/users.exceptions';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users');
    const users = await this.userModel.find();
    if (!Array.isArray(users)) {
      this.logger.warn('Failed to fetch users: result is not an array');
      throw new InternalServerErrorException('Cannot fetch users');
    }
    return users;
  }

  async findOne(id: string): Promise<User> {
    this.logger.log(`Fetching user with id: ${id}`);
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      this.logger.warn(`User with id: ${id} not found`);
      throw new UserFetchException();
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    this.logger.log(`Fetching user with email: ${email}`);
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      this.logger.warn(`User with email: ${email} not found`);
      throw new UserFetchException();
    }
    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    this.logger.log(`Creating new user with email: ${userData.email}`);
    const newUser = new this.userModel(userData);
    const user = await newUser.save();
    if (!user) {
      this.logger.warn('Failed to create user');
      throw new CreateUserException();
    }
    return user;
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    this.logger.log(`Updating user with id: ${id}`);
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) {
      this.logger.warn(`Failed to update user: User with id: ${id} not found`);
      throw new UserFetchException();
    }
    return updatedUser;
  }

  async updateByEmail(email: string, updateData: Partial<User>): Promise<User> {
    this.logger.log(`Updating user with email: ${email}`);
    const updatedUser = await this.userModel.findOneAndUpdate({ email }, updateData, { new: true });
    if (!updatedUser) {
      this.logger.warn(`Failed to update user: User with email: ${email} not found`);
      throw new UserFetchException();
    }
    return updatedUser;
  }

  async delete(id: string): Promise<string> {
    this.logger.log(`Deleting user with id: ${id}`);
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      this.logger.warn(`Failed to delete user: User with id: ${id} not found`);
      throw new UserFetchException();
    }
    return 'User deleted successfully';
  }
}
