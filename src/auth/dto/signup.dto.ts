import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsObject, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'Tarek Samy' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: { question: 'What is your favorite color?', answer: 'blue' } })
  @IsObject()
  verification: {
    question: string;
    answer: string;
  };
}
