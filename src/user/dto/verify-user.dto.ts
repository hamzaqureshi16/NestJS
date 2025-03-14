import { ApiProperty } from '@nestjs/swagger';

export class VerifyUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  constructor(data: Partial<VerifyUserDto>) {
    Object.assign(this, data);
  }
}
