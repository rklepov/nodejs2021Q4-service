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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserId } from './interfaces/user.interface';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId', ParseUUIDPipe) id: UserId) {
    return this.usersService.findOne(id);
  }

  @Put(':userId')
  edit(
    @Param('userId', ParseUUIDPipe) id: UserId,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.edit(id, createUserDto);
  }

  @Patch(':userId')
  update(
    @Param('userId', ParseUUIDPipe) id: UserId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('userId', ParseUUIDPipe) id: UserId) {
    return this.usersService.remove(id);
  }
}

// __EOF__
