import { Module } from '@nestjs/common';
import { TestAttemptService } from './test-attempt.service';
import { TestAttemptController } from './test-attempt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestAttempt } from './entities/test-attempt.entity';
import { MockTest } from 'src/mock-test/entities/mock-test.entity';
import { Account } from 'src/account/entities/account.entity';


@Module({
  imports:[
TypeOrmModule.forFeature([
  TestAttempt,MockTest,Account
])
  ],
  controllers: [TestAttemptController],
  providers: [TestAttemptService],
})
export class TestAttemptModule {}
