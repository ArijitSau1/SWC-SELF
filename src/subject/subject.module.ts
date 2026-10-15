import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { SchoolClass } from 'src/school-class/entities/school-class.entity';
import { Semester } from 'src/semester/entities/semester.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Subject,SchoolClass,Semester])
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
