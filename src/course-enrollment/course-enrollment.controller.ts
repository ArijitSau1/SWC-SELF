import { Controller, Post, UseGuards, Body, Query, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CourseEnrollmentService } from './course-enrollment.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from 'src/account/entities/account.entity';
import { CreateCourseEnrollmentDto } from './dto/create-course-enrollment.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';

@Controller('course-enrollment')
@UseGuards(AuthGuard('jwt'))
export class CourseEnrollmentController {
  constructor(
    private readonly courseEnrollmentService: CourseEnrollmentService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async enroll(
    @CurrentUser() user: Account,
    @Body() dto: CreateCourseEnrollmentDto,
  ) {
    return this.courseEnrollmentService.enroll(user.id, dto);
  }

  @Get('my-course')
  @UseGuards(AuthGuard('jwt'))
  myCourses(
    @CurrentUser() user: Account,
    @Query() query: DefaultStatusPaginationDto,
  ) {
    return this.courseEnrollmentService.myCourses(user.id, query);
  }
}
