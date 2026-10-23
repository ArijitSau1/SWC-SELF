import { Module } from '@nestjs/common';
import { CompetitiveExamService } from './competitive-exam.service';
import { CompetitiveExamController } from './competitive-exam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitiveExam } from './entities/competitive-exam.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([CompetitiveExam])
  ],
  controllers: [CompetitiveExamController],
  providers: [CompetitiveExamService],
})
export class CompetitiveExamModule {}
