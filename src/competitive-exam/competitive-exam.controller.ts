import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CompetitiveExamService } from './competitive-exam.service';
import { CreateCompetitiveExamDto } from './dto/create-competitive-exam.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';

@Controller('competitive-exam')
export class CompetitiveExamController {
  constructor(private readonly competitiveExamService: CompetitiveExamService) {}

  @Post()
    async create(@Body() dto: CreateCompetitiveExamDto) {
      return this.competitiveExamService.create(dto);
    }
  
    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.USER)
    find(@Query() query: DefaultStatusPaginationDto) {
      return this.competitiveExamService.findAll(query);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.competitiveExamService.findOne(id);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.competitiveExamService.remove(id);
    }
}
