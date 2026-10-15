import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UniversityService } from './university.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';

@Controller('university')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}
    @Post('create')
    async create(@Body() dto: CreateUniversityDto) {
      return this.universityService.create(dto);
    }
  
    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.USER)
    find(@Query() query: DefaultStatusPaginationDto) {
      return this.universityService.findAll(query);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.universityService.findOne(id);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.universityService.remove(id);
    }
}
