import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { User } from './../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string; user: User }> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isMatch = await bcrypt.compare(pass, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { name: user.name, email: user.email };
      const access_token = await this.jwtService.signAsync(payload);
      return { access_token, user };
    } catch (error) {
      throw new InternalServerErrorException(`Error during sign in: ${error?.message ?? error}`);
    }
  }

  async signUp(signUpDto: Partial<User>): Promise<{ access_token: string; user: User }> {
    try {
      let userRecord: User | null = null;
      try {
        userRecord = await this.usersService.findByEmail(signUpDto.email!);
      } catch {}
      if (userRecord) {
        throw new ForbiddenException('Email already in use');
      }
      const user = await this.usersService.create(signUpDto);
      const payload = { name: user.name, email: user.email };
      const access_token = await this.jwtService.signAsync(payload);
      return { access_token, user };
    } catch (error) {
      throw new InternalServerErrorException(`Error during sign up: ${error?.message ?? error}`);
    }
  }

  async validateUser(email: string): Promise<User | null> {
    try {
      const user = await this.usersService.findByEmail(email);
      return user || null;
    } catch (error) {
      throw new InternalServerErrorException(`Error validating user: ${error?.message ?? error}`);
    }
  }

  async validateQuestion(email: string, answer: string): Promise<User | null> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        return null;
      }
      const isMatch = await bcrypt.compare(answer, user.verification.answer);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid answer');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(`Error validating question: ${error?.message ?? error}`);
    }
  }

  async resetPassword(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.usersService.updateByEmail(user.email, { password: hashedPassword });
      user.password = hashedPassword;
      return user;
    } catch (error) {
      throw new InternalServerErrorException(`Error resetting password: ${error?.message ?? error}`);
    }
  }
}
