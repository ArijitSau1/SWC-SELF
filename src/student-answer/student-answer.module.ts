import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentAnswer } from './entities/student-answer.entity';
import { TestAttempt } from 'src/test-attempt/entities/test-attempt.entity';
import { Question } from 'src/question/entities/question.entity';
import { StudentAnswerService } from './student-answer.service';
import { StudentAnswerController } from './student-answer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StudentAnswer, TestAttempt, Question])],
  controllers: [StudentAnswerController],
  providers: [StudentAnswerService],
})
export class StudentAnswerModule {}
