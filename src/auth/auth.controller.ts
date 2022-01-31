// auth.controller.ts

/* import { Request } from 'express'; */

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('login')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  /* @UseGuards(LocalAuthGuard) */
  @HttpCode(HttpStatus.OK)
  login(/* @Req() request: Request, */ @Body() loginAuthDto: LoginAuthDto) {
    //
    // TODO: I wouldn't like to fall back to express Request object so not using
    // LocalAuthGuard here as suggested in the example
    // https://docs.nestjs.com/security/authentication#login-route and rather
    // implement the whole authentication logic directly in the service
    //
    // return this.authService.login(request.user);

    return this.authService.login(loginAuthDto);
  }
}

// __EOF__
