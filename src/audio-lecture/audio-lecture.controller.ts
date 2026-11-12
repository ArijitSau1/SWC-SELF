import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { AudioLectureService } from './audio-lecture.service';
import { CreateAudioLactureDto } from './dto/create-audio-lecture.dto';
import { audioFileFilter } from 'src/utils/fileUpload.utils';

@Controller('audio-lecture')
export class AudioLectureController {
  constructor(private readonly audioLactureService: AudioLectureService) {}

  @Post()
  async create(@Body() dto: CreateAudioLactureDto) {
    return this.audioLactureService.create(dto);
  }

  @Put('audio/:id')
  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/AudioLecture',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');

          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: audioFileFilter,
    }),
  )
  async audio(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileData = await this.audioLactureService.findOne(id);
    return this.audioLactureService.audio(file, fileData);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  find(@Query() query: DefaultStatusPaginationDto) {
    return this.audioLactureService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.audioLactureService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.audioLactureService.remove(id);
  }
}
