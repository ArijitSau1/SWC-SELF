import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { DegreeService } from './degree.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';

@Controller('degree')
export class DegreeController {
  constructor(private readonly degreeService: DegreeService) {}

  @Post('create')
  async create(@Body() dto: CreateDegreeDto) {
    return this.degreeService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  find(@Query() query: DefaultStatusPaginationDto) {
    return this.degreeService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.degreeService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.degreeService.remove(id);
  }
}
