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
import { VideoLectureService } from './video-lecture.service';
import { CreateVideoLactureDto } from './dto/create-video-lecture.dto';

@Controller('video-lecture')
export class VideoLectureController {
  constructor(private readonly videoLactureService: VideoLectureService) {}

  @Post()
  async create(@Body() dto: CreateVideoLactureDto) {
    return this.videoLactureService.create(dto);
  }

  @Put('video/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/VideoLecture',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async video(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.mp4' }),
          new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileData = await this.videoLactureService.findOne(id);
    return this.videoLactureService.video(file.path, fileData);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  find(@Query() query: DefaultStatusPaginationDto) {
    return this.videoLactureService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoLactureService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoLactureService.remove(id);
  }
}
