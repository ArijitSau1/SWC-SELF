import {
  Body,
  Controller,
  Delete,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { NewsService } from './news.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { imageFileFilter } from 'src/utils/fileUpload.utils';
import { CreateNewsDto } from './dto/create-news.dto';


@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
    async create(@Body() dto: CreateNewsDto) {
      return this.newsService.create(dto);
    }
  
    @Put(':id')
    // @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/NewsFeed',
          filename: (req, file, callback) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
  
            return callback(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        fileFilter: imageFileFilter,
      }),
    )
    async audio(
      @Param('id') id: string,
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          ],
        }),
      )
      file: Express.Multer.File,
    ) {
      const fileData = await this.newsService.findOne(id);
      return this.newsService.news(file.path, fileData);
    }
  
    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.USER)
    find(@Query() query: DefaultStatusPaginationDto) {
      return this.newsService.findAll(query);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.newsService.findOne(id);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.newsService.remove(id);
    }
}
