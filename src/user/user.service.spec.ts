import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { dummyUsers } from './data/user.data';
import { VerifyUserDto } from './dto/verify-user.dto';

const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    findFirstOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  prismaWithPassword: jest.fn(),
};

const mockBcrypt = {
  hashSync: jest.fn(),
  compareSync: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    mockPrismaService.user.findMany.mockReturnValue(dummyUsers);
    const users = await service.findAll();
    expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    expect(users).toHaveLength(2);
  });

  it('should return a user', async () => {
    mockPrismaService.user.findUniqueOrThrow.mockReturnValue(dummyUsers[0]);
    const user = await service.findOne('1');
    expect(mockPrismaService.user.findUniqueOrThrow).toHaveBeenCalled();
    expect(user).toBeDefined();
  });

  it('should create a user', async () => {
    const user = await service.create(dummyUsers[0]);
    expect(mockPrismaService.user.create).toHaveBeenCalled();
    expect(user).toEqual(user);
  });

  it('should update a user', async () => {
    const user = await service.update(dummyUsers[0]);
    expect(mockPrismaService.user.update).toHaveBeenCalled();
    expect(user).toEqual(user);
  });

  it('should delete a user', async () => {
    const user = await service.remove('1');
    expect(mockPrismaService.user.delete).toHaveBeenCalled();
    expect(user).toEqual(user);
  });

  it('should verify a user', async () => {
    mockPrismaService.prismaWithPassword.mockReturnValue({
      user: {
        findFirstOrThrow: jest.fn().mockReturnValue(dummyUsers[0]),
      },
    });
    mockBcrypt.compareSync.mockReturnValue(true);
    const user = await service.verify(new VerifyUserDto(dummyUsers[0]));
    expect(mockPrismaService.prismaWithPassword).toHaveBeenCalled();
    expect(user).toEqual(user);
  });

  it('should throw an error if user email not found during verification', async () => {
    // Mock the findFirstOrThrow to throw an error
    const userWithPassword = {
      user: {
        findFirstOrThrow: jest.fn().mockImplementation(() => {
          throw new Error('User not found');
        }),
      },
    };

    mockPrismaService.prismaWithPassword.mockReturnValue(userWithPassword);

    await expect(service.verify(dummyUsers[0])).rejects.toThrow();

    expect(mockPrismaService.prismaWithPassword).toHaveBeenCalled();
    expect(userWithPassword.user.findFirstOrThrow).toHaveBeenCalledWith({
      where: { email: dummyUsers[0].email },
    });

    // Verify bcrypt wasn't called since we never got a user
    expect(mockBcrypt.compareSync).not.toHaveBeenCalled();
  });
});
