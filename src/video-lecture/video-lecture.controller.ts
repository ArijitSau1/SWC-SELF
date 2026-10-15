import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
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

@Controller('video-lecture')
export class VideoLectureController {
    constructor(private readonly videoLactureService: VideoLectureService) {}
    
      @Post()
      @UseGuards(AuthGuard('jwt'), RolesGuard)
      @Roles(UserRole.ADMIN)
      @UseInterceptors(
        FileInterceptor('file', {
          storage: diskStorage({
            destination: './uploads/Study_material',
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
      async create(
        @UploadedFile(
          new ParseFilePipe({
            validators: [
              new FileTypeValidator({ fileType: '.(pdf)' }),
              new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 1 }),
            ],
          }),
        )
        file: Express.Multer.File,
      ) {
        // return this.StudyMaterialService.create(file.path);
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
