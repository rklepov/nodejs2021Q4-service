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
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LoggerService } from '../common/logger/logger.service';
import { FilesExceptionFilter } from './exceptions/files-exception.filter';
import { FilesService } from './files.service';
import { FileName } from './interfaces/file.interface';
import { FileInterceptor } from './multer/file.interceptor';

@ApiTags('File')
@Controller('file') // ! 'file' (not 'files')
@UseFilters(FilesExceptionFilter)
export class FilesController {
  constructor(
    private readonly logger: LoggerService,
    private readonly filesService: FilesService,
  ) {}

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
