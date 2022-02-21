// update-task.dto.ts

import { PartialType } from '@nestjs/swagger';

import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

// __EOF__
