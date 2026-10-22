import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestAttempt } from './entities/test-attempt.entity';
import { Repository } from 'typeorm';
import { MockTest } from 'src/mock-test/entities/mock-test.entity';
import { Brackets } from 'typeorm/browser';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';

@Injectable()
export class TestAttemptService {
     constructor(
    @InjectRepository(TestAttempt)
    private readonly repo: Repository<TestAttempt>,

    @InjectRepository(MockTest)
    private readonly mockTestRepo: Repository<MockTest>,
  ) {}

  async findAll(dto: DefaultStatusPaginationDto, accountId: string) {
  const keyword = dto.keyword || '';

  const [result, count] = await this.repo
    .createQueryBuilder('testAttempt')
    .leftJoinAndSelect('testAttempt.mockTest', 'mockTest')
    .where('testAttempt.accountId = :accountId', { accountId })
    .andWhere(
      new Brackets((qb) => {
        qb.where('mockTest.title LIKE :title', {
          title: '%' + keyword + '%',
        });
      }),
    )
    .take(dto.limit)
    .skip(dto.offset)
    .getManyAndCount();

  return { result, count };
}

async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}
