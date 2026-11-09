import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StreamService } from './stream.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateStreamDto } from './dto/create-stream.dto';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Post()
  create(@Body() dto: CreateStreamDto) {
    return this.streamService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  find(@Query() query: DefaultStatusPaginationDto) {
    return this.streamService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.streamService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.streamService.remove(id);
  }
}
