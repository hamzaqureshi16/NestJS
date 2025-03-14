import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;

  constructor(data: Partial<CreateUserDto>) {
    Object.assign(this, data);
  }
}
