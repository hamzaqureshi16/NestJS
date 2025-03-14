import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { VerifyUserDto } from './dto/verify-user.dto';
import { User } from './entities/user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          password: bcrypt.hashSync(createUserDto.password, 10),
        },
      });

      return new User(user);
    } catch (error) {
      this.handlePrismaError(error, 'create user');
    }
  }

  async findAll() {
    try {
      const user = await this.prisma.user.findMany();
      return user.map((u) => new User(u));
    } catch (error) {
      this.handlePrismaError(error, 'find all users');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
      return new User(user);
    } catch (error) {
      this.handlePrismaError(error, 'find one user');
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: updateUserDto.id,
        },
        data: {
          email: updateUserDto.email,
          name: updateUserDto.name,
          password: updateUserDto.password
            ? bcrypt.hashSync(updateUserDto.password, 10)
            : undefined,
        },
      });

      return new User(user);
    } catch (error) {
      this.handlePrismaError(error, 'update user');
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });

      return new User(user);
    } catch (error) {
      this.handlePrismaError(error, 'delete user');
    }
  }

  async verify(verifyUserDto: VerifyUserDto): Promise<User | null> {
    try {
      const user = await this.prisma
        .prismaWithPassword()
        .user.findFirstOrThrow({
          where: {
            email: verifyUserDto.email,
          },
        });

      return bcrypt.compareSync(verifyUserDto.password, user.password)
        ? new User(user)
        : null;
    } catch (error) {
      this.handlePrismaError(error, 'verify user');
    }
  }

  private handlePrismaError(error: any, operation: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': // Unique constraint violation
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              message: `Unique constraint violated on: ${(error.meta?.target as string[])?.join(', ')}`,
              error: 'Conflict',
            },
            HttpStatus.CONFLICT,
          );

        case 'P2025': // Record not found
          throw new HttpException(
            {
              statusCode: HttpStatus.NOT_FOUND,
              message: 'Record not found',
              error: 'Not Found',
            },
            HttpStatus.NOT_FOUND,
          );

        // Custom status code example (422 Unprocessable Entity)
        case 'P2003': // Foreign key constraint failed
          throw new HttpException(
            {
              statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
              message: `Foreign key constraint failed on field: ${error.meta?.field_name}`,
              error: 'Unprocessable Entity',
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );

        // Another custom status code (423 Locked)
        case 'P2014':
          throw new HttpException(
            {
              statusCode: HttpStatus.LOCKED,
              message: 'Resource is locked or in use',
              error: 'Locked',
            },
            HttpStatus.LOCKED, // 423
          );

        default:
          console.error(`Unhandled Prisma error: ${error.code}`, error);
          throw new HttpException(
            {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: `Failed to ${operation}: ${error.message}`,
              error: 'Internal Server Error',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }

    // Validation errors with custom status code
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `Validation error: ${error.message}`,
          error: 'Unprocessable Entity',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // Fallback for unexpected errors
    console.error(`Error during ${operation}:`, error);
    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Failed to ${operation}`,
        error: 'Internal Server Error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
