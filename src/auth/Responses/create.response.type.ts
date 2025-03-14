import { UpdateUserDto } from '../../user/dto/update-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export interface AuthResponse {
  user: Omit<UpdateUserDto, 'password' | 'createdAt' | 'updatedAt'>;
  token: string;
}

export class AuthResponseDto implements AuthResponse {
  @ApiProperty({
    type: UpdateUserDto,
  })
  user: Omit<UpdateUserDto, 'password' | 'createdAt' | 'updatedAt'>;

  @ApiProperty()
  token: string;
}

export class AuthResponseErrorDto {
  @ApiProperty()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
