import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from '../users/user.schema';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    signUp: jest.fn(),
    validateUser: jest.fn(),
    getMe: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login a user, set cookies, and return user info', async () => {
      const loginDto: LoginDto = { email: 'test@test.com', password: 'password' };
      const result = { access_token: 'mock_token', user: { email: 'test@test.com' } as User };
      mockAuthService.login.mockResolvedValue(result);
      const response = await controller.login(loginDto, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(mockResponse.cookie).toHaveBeenCalledWith('access_token', 'Bearer mock_token', expect.objectContaining({ httpOnly: true }));
      expect(mockResponse.cookie).toHaveBeenCalledWith('csrf_token', expect.any(String), expect.objectContaining({ sameSite: 'strict' }));
      expect(response).toEqual({ user: result.user, csrfToken: expect.any(String) });
    });
  });

  describe('signUp', () => {
    it('should register a user, set cookies, and return user info', async () => {
      const signupDto: SignupDto = {
        email: 'new@test.com',
        password: 'password',
        name: 'New User',
        verification: { question: 'q', answer: 'a' },
      };
      const result = { access_token: 'mock_token', user: { email: 'new@test.com' } as User };
      mockAuthService.signUp.mockResolvedValue(result);
      const response = await controller.signUp(signupDto, mockResponse);

      expect(authService.signUp).toHaveBeenCalledWith(signupDto);
      expect(mockResponse.cookie).toHaveBeenCalledWith('access_token', 'Bearer mock_token', expect.any(Object));
      expect(response).toEqual({ user: result.user, csrfToken: expect.any(String) });
    });
  });

  describe('validateUser', () => {
    it('should validate a user email and return the security question', async () => {
      const dto = { email: 'test@test.com' };
      const question = 'What is your pet name?';
      mockAuthService.validateUser.mockResolvedValue(question);
      const result = await controller.validateUser(dto);

      expect(authService.validateUser).toHaveBeenCalledWith(dto.email);
      expect(result).toBe(question);
    });
  });
});
