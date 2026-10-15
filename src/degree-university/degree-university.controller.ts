import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { DegreeUniversityService } from './degree-university.service';
import { CreateDegreeDto } from 'src/degree/dto/create-degree.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { CreateDegreeUniversityDto } from './dto/create-degree-university.dto';

@Controller('degree-university')
export class DegreeUniversityController {
  constructor(private readonly degreeUniversityService: DegreeUniversityService) {}


@Post('create')
  async create(@Body() dto: CreateDegreeUniversityDto) {
    return this.degreeUniversityService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  find(@Query() query: DefaultStatusPaginationDto) {
    return this.degreeUniversityService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.degreeUniversityService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.degreeUniversityService.remove(id);
  }
}
