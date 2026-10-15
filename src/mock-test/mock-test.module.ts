import { Module } from '@nestjs/common';
import { MockTestService } from './mock-test.service';
import { MockTestController } from './mock-test.controller';
import { MockTest } from './entities/mock-test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from 'src/subject/entities/subject.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      MockTest,Subject
    ])
  ],
  controllers: [MockTestController],
  providers: [MockTestService],
})
export class MockTestModule {}
