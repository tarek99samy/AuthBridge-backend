import type { Response } from 'express';
import { Body, Controller, HttpCode, HttpStatus, Post, Get, Req, UseGuards, Res, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { randomUUID } from 'crypto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyUserDto, VerifyQuestionDto } from './dto/reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import AuthGuard from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@Req() req: { email: string; name: string }) {
    this.logger.log(`Fetching current user info for email: ${req.email}`);
    return { email: req.email, name: req.name };
  }

  @Get('csrf-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a new CSRF token' })
  @ApiResponse({ status: 200, description: 'CSRF token generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCsrfToken(@Res({ passthrough: true }) res: Response) {
    this.logger.log(`Generating new CSRF token`);
    const csrfToken = randomUUID();
    res.cookie('csrf_token', csrfToken, { httpOnly: false, secure: false, sameSite: 'strict' });
    return { csrfToken };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { access_token, user } = await this.authService.login(dto.email, dto.password);
    res.cookie('access_token', `Bearer ${access_token}`, { httpOnly: true, secure: false, sameSite: 'lax' });

    const csrfToken = randomUUID();
    res.cookie('csrf_token', csrfToken, { httpOnly: false, secure: false, sameSite: 'strict' });

    return { user, csrfToken };
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 403, description: 'Email already in use' })
  async signUp(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
    const { access_token, user } = await this.authService.signUp(dto);
    res.cookie('access_token', `Bearer ${access_token}`, { httpOnly: true, secure: false, sameSite: 'lax' });

    const csrfToken = randomUUID();
    res.cookie('csrf_token', csrfToken, { httpOnly: false, secure: false, sameSite: 'strict' });

    return { user, csrfToken };
  }

  @Post('verify-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user by email' })
  @ApiResponse({ status: 200, description: 'User validated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async validateUser(@Body() dto: VerifyUserDto) {
    return this.authService.validateUser(dto.email);
  }

  @Post('verify-question')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify security question answer' })
  @ApiResponse({ status: 200, description: 'Security question validated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid security answer' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async validateQuestion(@Body() dto: VerifyQuestionDto) {
    return this.authService.validateQuestion(dto.email, dto.answer);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.password);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out' })
  logout(@Res({ passthrough: true }) res: Response) {
    this.logger.log(`Logging out a user`);
    res.clearCookie('access_token', { httpOnly: true });
    res.clearCookie('csrf_token');
    return { message: 'Logged out' };
  }
}
