import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StudentAnswerService } from './student-answer.service';
import { CreateStudentAnswerDto } from './dto/create-student-answer.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from 'src/account/entities/account.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('student-answer')
export class StudentAnswerController {
  constructor(private readonly studentAnswerService: StudentAnswerService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() dto: CreateStudentAnswerDto,
    @CurrentUser() user: Account,
  ) {
    return this.studentAnswerService.create(dto, user.id);
  }

  @Get('attempt/:attemptId')
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @Param('attemptId') attemptId: string,
    @CurrentUser() user: Account,
  ) {
    return this.studentAnswerService.findAll(attemptId, user.id);
  }
}
