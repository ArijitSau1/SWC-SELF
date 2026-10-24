import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CompetitiveCategoryService } from './competitive-category.service';
import { CreateCompetitiveCategoryDto } from './dto/create-competitive-category.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';

@Controller('competitive-category')
export class CompetitiveCategoryController {
  constructor(
    private readonly competitiveCategoryService: CompetitiveCategoryService,
  ) {}

  @Post('create')
  async create(@Body() dto: CreateCompetitiveCategoryDto) {
    return this.competitiveCategoryService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  find(@Query() query: DefaultStatusPaginationDto) {
    return this.competitiveCategoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competitiveCategoryService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competitiveCategoryService.remove(id);
  }
}
