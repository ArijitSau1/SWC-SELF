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
import { MockTestService } from './mock-test.service';
import { CreateMockTestDto } from './dto/create-mock-test.dto';

@Controller('mock-test')
export class MockTestController {
  constructor(private readonly mockTestService: MockTestService) {}

    @Post()
    async create(@Body() dto: CreateMockTestDto) {
      return this.mockTestService.create(dto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.USER)
    find(@Query() query: DefaultStatusPaginationDto) {
      return this.mockTestService.findAll(query);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.mockTestService.findOne(id);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.mockTestService.remove(id);
    }
}
