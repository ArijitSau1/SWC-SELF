import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';

@Controller('semester')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}
             @Get()
              @UseGuards(AuthGuard('jwt'),RolesGuard)
              @Roles(UserRole.USER)
              find(@Query() query: DefaultStatusPaginationDto) {
                return this.semesterService.findAll(query);
              }
            
              @Get(':id')
              findOne(@Param('id') id: string) {
                return this.semesterService.findOne(id);
              }
            
              @Delete(':id')
              remove(@Param('id') id: string) {
                return this.semesterService.remove(id);
              }
  
}
