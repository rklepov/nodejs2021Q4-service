// create-user.dto.ts

import { IsAscii, IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name = '';

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  login = '';

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsAscii()
  password = '';
}

// __EOF__
