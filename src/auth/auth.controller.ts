import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyUserDto, VerifyQuestionDto } from './dto/reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  async signIn(@Body() dto: LoginDto) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  async signUp(@Body() dto: SignupDto) {
    return this.authService.signUp(dto);
  }

  @Post('verify-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user by email' })
  async validateUser(@Body() dto: VerifyUserDto) {
    return this.authService.validateUser(dto.email);
  }

  @Post('verify-question')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify security question answer' })
  async validateQuestion(@Body() dto: VerifyQuestionDto) {
    return this.authService.validateQuestion(dto.email, dto.answer);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.password);
  }
}
