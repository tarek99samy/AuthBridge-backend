import { Injectable, UnauthorizedException } from '@nestjs/common';
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
  }

  async signUp(signUpDto: Partial<User>): Promise<{ access_token: string; user: User }> {
    const userRecord = await this.usersService.findByEmail(signUpDto.email!);
    if (userRecord) {
      throw new UnauthorizedException('Email already in use');
    }
    const user = await this.usersService.create(signUpDto);
    const payload = { name: user.name, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token, user };
  }

  async validateUser(email: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async validateQuestion(email: string, answer: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const answerHashed = await bcrypt.hash(answer, 50);
    const isMatch = await bcrypt.compare(answerHashed, user.verification.answer);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid answer');
    }
    return user;
  }

  async resetPassword(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const hashedPassword = await bcrypt.hash(password, 50);
    user.password = hashedPassword;
    await this.usersService.updateByEmail(user.email, { password: hashedPassword });
    return user;
  }
}
