import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty({ example: 'test@test.com' })
  email: string;
}

export class VerifyQuestionDto {
  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @ApiProperty({ example: 'blue' })
  answer: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @ApiProperty({ example: 'NewP@ssw0rd' })
  @MinLength(8)
  password: string;
}
