import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { VerifyUserDto } from '../user/dto/verify-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './Responses/create.response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(verifyUserDto: VerifyUserDto): Promise<AuthResponseDto> {
    const user = await this.userService.verify(verifyUserDto);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      user,
      token: this.jwtService.sign({
        email: user.email,
        sub: user.id,
      }),
    };
  }

  async signup(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const user = await this.userService.create(createUserDto);

    return {
      user,
      token: this.jwtService.sign({
        email: user.email,
        sub: user.id,
      }),
    };
  }
}
