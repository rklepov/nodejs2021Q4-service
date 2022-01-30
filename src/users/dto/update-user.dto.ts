// update-user.dto.ts

import { IsAscii, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto /* extends PartialType(CreateUserDto) */ {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  login?: string;

  @IsOptional()
  @IsString()
  @IsAscii()
  password?: string;
}

// __EOF__
