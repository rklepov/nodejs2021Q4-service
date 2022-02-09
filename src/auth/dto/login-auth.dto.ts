// login-auth.dto.ts

import { IsAscii, IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
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
