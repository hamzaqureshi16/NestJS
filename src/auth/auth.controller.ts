import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyUserDto } from '../user/dto/verify-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import {
  AuthResponseDto,
  AuthResponseErrorDto,
} from './Responses/create.response.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`login`)
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: AuthResponseErrorDto,
  })
  @ApiBody({
    type: VerifyUserDto,
    description: 'User credentials',
  })
  async login(
    @Body() payload: VerifyUserDto,
    @Res() res: Response<AuthResponseDto | AuthResponseErrorDto>,
  ) {
    return await this.authService
      .login(payload)
      .then((response) => {
        const { user, token } = response;

        res.status(HttpStatus.OK).send(
          new AuthResponseDto({
            user: user,
            token,
          }),
        );
      })
      .catch((error: any) => {
        res
          .status(error instanceof HttpException ? error.getStatus() : 400)
          .send(
            new AuthResponseErrorDto((error as Error).message ?? 'Bad request'),
          );
      });
  }

  @Post(`signup`)
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: AuthResponseErrorDto,
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User credentials',
  })
  async signup(
    @Body() payload: CreateUserDto,
    @Res() res: Response<AuthResponseDto | AuthResponseErrorDto>,
  ) {
    return await this.authService
      .signup(payload)
      .then((response) => {
        res.status(HttpStatus.OK).send(response);
      })
      .catch((error: any) => {
        res
          .status(error instanceof HttpException ? error.getStatus() : 400)
          .send(
            new AuthResponseErrorDto((error as Error).message ?? 'Bad request'),
          );
      });
  }
}
