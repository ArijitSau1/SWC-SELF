import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { MockTest } from 'src/mock-test/entities/mock-test.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Question,MockTest
    ])
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
