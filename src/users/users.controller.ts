// users.controller.ts

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body(new ValidationPipe({ whitelist: true }))
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':userId')
  edit(
    @Param('userId', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.edit(id, createUserDto);
  }

  @Patch(':userId')
  update(
    @Param('userId', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('userId', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}

// __EOF__
