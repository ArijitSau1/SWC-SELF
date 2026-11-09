import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PermissionAction, UserRole } from 'src/enum';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';

@Controller('board')
export class BoardController {
    constructor(private readonly boardService:BoardService){}

     @Post('create')
      async create(@Body() dto: CreateBoardDto) {
        return this.boardService.create(dto);
      }
    
      @Get()
      @UseGuards(AuthGuard('jwt'),RolesGuard,PermissionsGuard)
      @Roles(UserRole.ADMIN)
      @CheckPermissions([PermissionAction.READ,'board'])
      find(@Query() query: DefaultStatusPaginationDto) {
        return this.boardService.findAll(query);
      }
    
      @Get(':id')
      findOne(@Param('id') id: string) {
        return this.boardService.findOne(id);
      }
    
      @Delete(':id')
      remove(@Param('id') id: string) {
        return this.boardService.remove(id);
      }
}
