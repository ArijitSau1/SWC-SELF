import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Subject } from 'src/subject/entities/subject.entity';


@Module({
  imports:  [
  TypeOrmModule.forFeature([
      Course,
      Subject
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
