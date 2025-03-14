import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VerifyUserDto } from '../user/dto/verify-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  AuthResponseDto,
  AuthResponseErrorDto,
  UserResponseDto,
} from './Responses/create.response.type';
import { Response } from 'express';
import { dummyUsers } from '../user/data/user.data';
import { HttpStatus } from '@nestjs/common';

const mockAuthService = {
  login: jest.fn(),
  signup: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login user successfully', async () => {
    const verifyUserDto: VerifyUserDto = {
      email: dummyUsers[0].email,
      password: dummyUsers[0].password,
    };
    const user: UserResponseDto = {
      id: '1',
      email: dummyUsers[0].email,
      name: dummyUsers[0].name,
    };
    const token = 'token';
    mockAuthService.login.mockResolvedValue({ user, token });

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    await controller.login(
      verifyUserDto,
      res as unknown as Response<AuthResponseDto | AuthResponseErrorDto>,
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.send).toHaveBeenCalledWith(new AuthResponseDto({ user, token }));
  });

  it('should handle error during login', async () => {
    const verifyUserDto: VerifyUserDto = {
      email: dummyUsers[0].email,
      password: dummyUsers[0].password,
    };
    mockAuthService.login.mockRejectedValue(new Error('User not found'));

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    await controller.login(
      verifyUserDto,
      res as unknown as Response<AuthResponseDto | AuthResponseErrorDto>,
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      new AuthResponseErrorDto('User not found'),
    );
  });

  it('should signup user successfully', async () => {
    const createUserDto: CreateUserDto = {
      email: dummyUsers[0].email,
      password: dummyUsers[0].password,
      name: dummyUsers[0].name,
    };
    const user = { id: 1, email: dummyUsers[0].email };
    const token = 'token';
    mockAuthService.signup.mockResolvedValue({ user, token });

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    await controller.signup(
      createUserDto,
      res as unknown as Response<AuthResponseDto | AuthResponseErrorDto>,
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.send).toHaveBeenCalledWith({ user, token });
  });

  it('should handle error during signup', async () => {
    const createUserDto: CreateUserDto = {
      email: dummyUsers[0].email,
      password: dummyUsers[0].password,
      name: dummyUsers[0].name,
    };
    mockAuthService.signup.mockRejectedValue(new Error('Error creating user'));

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    await controller.signup(
      createUserDto,
      res as unknown as Response<AuthResponseDto | AuthResponseErrorDto>,
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      new AuthResponseErrorDto('Error creating user'),
    );
  });
});
