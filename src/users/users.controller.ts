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
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DatabaseExceptionFilter } from '../db/exceptions/database-exception.filter';
import { UniqueConstraintExceptionFilter } from '../db/exceptions/unique-constraint-exception.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserId } from './interfaces/user.interface';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(DatabaseExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseFilters(UniqueConstraintExceptionFilter)
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
  @UseFilters(UniqueConstraintExceptionFilter)
  edit(
    @Param('userId', ParseUUIDPipe) id: UserId,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.edit(id, createUserDto);
  }

  @Patch(':userId')
  @UseFilters(UniqueConstraintExceptionFilter)
  update(
    @Param('userId', ParseUUIDPipe) id: UserId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('userId', ParseUUIDPipe) id: UserId) {
    await this.usersService.remove(id);
  }
}

// __EOF__
