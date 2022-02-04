// files.controller.ts

import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ApiTags } from '@nestjs/swagger';
import { FilesExceptionFilter } from './exceptions/files-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LoggerService } from '../common/logger/logger.service';
import { FilesService } from './files.service';
import { FileName } from './interfaces/file.interface';

@ApiTags('File')
@Controller('file') // ! 'file' (not 'files')
@UseFilters(FilesExceptionFilter)
export class FilesController {
  constructor(
    private readonly logger: LoggerService,
    private readonly filesService: FilesService,
  ) {
    this.logger.setContext(FilesController.name);
  }

  // eslint-disable-next-line class-methods-use-this
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @UseFilters(FilesExceptionFilter)
  upload(@UploadedFile() file: Express.Multer.File) {
    this.logger.debug(`uploading to '${file.path}'`);
    return { uploaded: file.originalname };
  }

  @Get()
  list() {
    return this.filesService.list();
  }

  @Get(':file')
  // ! GET is not protected because download will be tested via web browser
  download(@Param('file') filename: FileName) {
    return this.filesService.read(filename);
  }

  @Delete(':file')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('file') filename: FileName) {
    await this.filesService.remove(filename);
    return { removed: filename };
  }
}

// __EOF__
