import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { dummyUsers } from './data/user.data';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', () => {
    mockPrismaService.user.findMany.mockReturnValue(dummyUsers);
    const users = controller.findAll();
    expect(users).toHaveLength(dummyUsers.length);
  });

  it('should return a user', () => {
    mockPrismaService.user.findUnique.mockReturnValue(dummyUsers[0]);
    expect(controller.findOne('1')).toBeDefined();
  });
});
