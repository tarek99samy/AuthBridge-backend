import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.schema';
import AuthGuard from '../auth/auth.guard';
import CsrfGuard from '../auth/csrf.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(CsrfGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [{ email: 'test@test.com', name: 'Test User', status: 'active' } as User];
      mockUsersService.findAll.mockResolvedValue(result);
      expect(await controller.findAll()).toBe(result);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      const result: User = { email: 'test@test.com', name: 'Test User', status: 'active' } as User;
      const id = '6961ca4ee751fb25f281174e';
      mockUsersService.findOne.mockResolvedValue(result);
      expect(await controller.findOne(id)).toBe(result);
      expect(usersService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto: Partial<User> = { email: 'test@test.com', name: 'Test User', status: 'active' };
      const result: User = { ...dto, _id: '6961ca4ee751fb25f281174e' } as User;
      mockUsersService.create.mockResolvedValue(result);
      expect(await controller.create(dto)).toBe(result);
      expect(usersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('delete', () => {
    it('should delete a user and return success message', async () => {
      const id = 'someId';
      const result = 'User deleted successfully';
      mockUsersService.delete.mockResolvedValue(result);
      expect(await controller.delete(id)).toBe(result);
      expect(usersService.delete).toHaveBeenCalledWith(id);
    });
  });
});
