import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  constructor(user: Partial<User>) {
    this.id = user.id ?? '';
    this.email = user.email ?? '';
    this.name = user.name ?? '';
  }
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty()
  token: string;

  constructor(data: { user: Partial<User>; token: string }) {
    this.user = new UserResponseDto(data.user);
    this.token = data.token;
  }
}

export class AuthResponseErrorDto {
  @ApiProperty()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
