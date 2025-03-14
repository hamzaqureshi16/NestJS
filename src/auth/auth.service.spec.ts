import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { VerifyUserDto } from '../user/dto/verify-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { dummyUsers } from '../user/data/user.data';

const mockUserService = {
  verify: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login user', async () => {
    const verifyUserDto: VerifyUserDto = {
      email: dummyUsers[0].email,
      password: dummyUsers[0].password,
    };
    const user = { id: 1, email: 'test@example.com' };
    mockUserService.verify.mockResolvedValue(user);
    mockJwtService.sign.mockReturnValue('token');

    const result = await service.login(verifyUserDto);

    expect(result).toEqual({ user, token: 'token' });
  });

  it('should throw error if user not found during login', async () => {
    const verifyUserDto: VerifyUserDto = {
      email: dummyUsers[0].email,
      password: dummyUsers[0].password,
    };
    mockUserService.verify.mockResolvedValue(null);

    await expect(service.login(verifyUserDto)).rejects.toThrow(
      'User not found',
    );
  });

  it('should signup user', async () => {
    const createUserDto: CreateUserDto = {
      email: dummyUsers[0].email,
      password: dummyUsers[0].password,
      name: dummyUsers[0].name,
    };
    const user = { id: 1, email: dummyUsers[0].email };
    mockUserService.create.mockResolvedValue(user);
    mockJwtService.sign.mockReturnValue('token');

    const result = await service.signup(createUserDto);

    expect(result).toEqual({ user, token: 'token' });
  });

  it('should handle error during signup', async () => {
    const createUserDto: CreateUserDto = {
      email: dummyUsers[0].email,
      password: dummyUsers[0].password,
      name: dummyUsers[0].name,
    };
    mockUserService.create.mockImplementation(() => {
      throw new Error('Error creating user');
    });

    await expect(service.signup(createUserDto)).rejects.toThrow(
      'Error creating user',
    );
  });
});
