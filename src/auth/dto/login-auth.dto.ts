// login-auth.dto.ts

import { IsAscii, IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
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
