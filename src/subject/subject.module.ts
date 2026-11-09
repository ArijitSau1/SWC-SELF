import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { SchoolClass } from 'src/school-class/entities/school-class.entity';
import { Semester } from 'src/semester/entities/semester.entity';
import { CompetitiveExam } from 'src/competitive-exam/entities/competitive-exam.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Subject,SchoolClass,Semester,CompetitiveExam])
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
