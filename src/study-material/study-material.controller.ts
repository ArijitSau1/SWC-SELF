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
import { StudyMaterialService } from './study-material.service';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { CreateStudyMaterialDto } from './dto/create-study-material.dto';

@Controller('study-material')
export class StudyMaterialController {
  constructor(private readonly studyMaterialService: StudyMaterialService) {}

  @Post()
  async create(@Body() dto: CreateStudyMaterialDto) {
    return this.studyMaterialService.create(dto);
  }


  @Put('pdf/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/StudyMaterial',
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
  async pdf(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.pdf' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileData = await this.studyMaterialService.findOne(id);
    return this.studyMaterialService.pdf(file.path, fileData);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  find(@Query() query: DefaultStatusPaginationDto) {
    return this.studyMaterialService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studyMaterialService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studyMaterialService.remove(id);
  }
}
