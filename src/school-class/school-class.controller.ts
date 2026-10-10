import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SchoolClassService } from './school-class.service';
import { CreateSchoolClassDto } from './dto/create-school-class.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';

@Controller('school-class')
export class SchoolClassController {
  constructor(private readonly schoolClassService: SchoolClassService) {}

       @Post('create')
        async create(@Body() dto: CreateSchoolClassDto) {
          return this.schoolClassService.create(dto);
        }
      
        @Get()
        @UseGuards(AuthGuard('jwt'),RolesGuard)
        @Roles(UserRole.USER)
        find(@Query() query: DefaultStatusPaginationDto) {
          return this.schoolClassService.findAll(query);
        }
      
        @Get(':id')
        findOne(@Param('id') id: string) {
          return this.schoolClassService.findOne(id);
        }
      
        @Delete(':id')
        remove(@Param('id') id: string) {
          return this.schoolClassService.remove(id);
        }
}
