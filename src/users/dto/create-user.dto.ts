// create-user.dto.ts

import { IsAscii, IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  login!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsAscii()
  password!: string;
}

// __EOF__
