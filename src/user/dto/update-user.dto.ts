import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  id: string;

  constructor(data: Partial<UpdateUserDto>) {
    super();
    Object.assign(this, data);
  }
}
