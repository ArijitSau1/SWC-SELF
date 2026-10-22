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
import { QuestionService } from './question.service';
import { CreateBoardDto } from 'src/board/dto/create-board.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('create')
  async create(@Body() dto: CreateQuestionDto) {
    return this.questionService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  find(@Query() query: DefaultStatusPaginationDto) {
    return this.questionService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(id);
  }
}
