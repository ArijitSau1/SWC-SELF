import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestAttempt } from './entities/test-attempt.entity';
import { Repository } from 'typeorm';
import { MockTest } from 'src/mock-test/entities/mock-test.entity';
import { Brackets } from 'typeorm/browser';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { Account } from 'src/account/entities/account.entity';
import { CreateTestAttemptDto } from './dto/create-test-attempt.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class TestAttemptService {
  constructor(
    @InjectRepository(TestAttempt)
    private readonly repo: Repository<TestAttempt>,

    @InjectRepository(MockTest)
    private readonly mockTestRepo: Repository<MockTest>,

    @InjectRepository(Account)
    private readonly accoutRepo: Repository<Account>,
  ) {}

  async create(dto: CreateTestAttemptDto, accountId: string) {
    const mockTest = await this.mockTestRepo.findOne({
      where: { id: dto.mockTestId },
    });

    if (!mockTest) {
      throw new NotFoundException('Mock test not found');
    }

    const account = await this.accoutRepo.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const obj = Object.assign({
      ...dto,
      mockTest: mockTest,
      account: account,
      total_questions: mockTest.total_questions,
    });

    const saved = await this.repo.save(obj);
    return this.repo
      .createQueryBuilder('testAttempt')
      .select([
        'testAttempt.id',
        'testAttempt.total_questions',
        'testAttempt.correct',
        'testAttempt.wrong',
        'testAttempt.percentage',
        'testAttempt.createdAt',
      ])
      .where('testAttempt.id = :id', { id: saved.id })
      .getOne();
  }

  async submit(id: string, accountId: string) {
    const attempt = await this.repo.findOne({
      where: {
        id,
        account: { id: accountId },
      },
      relations: {
        studentAnswers: true,
      },
    });

    if (!attempt) {
      throw new NotFoundException('Test attempt not found');
    }

    if (attempt.status === DefaultStatus.SUBMITTED) {
      throw new ConflictException('Test already submitted');
    }

    let correct = 0;
    let wrong = 0;

    for (let i = 0; i < attempt.studentAnswers.length; i++) {
      if (attempt.studentAnswers[i].is_correct) {
        correct = correct + 1;
      } else {
        wrong = wrong + 1;
      }
    }

    const percentage = (correct / attempt.total_questions) * 100;
    attempt.correct = correct;
    attempt.wrong = wrong;
    attempt.percentage = percentage;
    attempt.status = DefaultStatus.SUBMITTED;

    const saved = await this.repo.save(attempt);
    return this.repo
      .createQueryBuilder('attempt')
      .select([
        'attempt.id',
        'attempt.total_questions',
        'attempt.correct',
        'attempt.wrong',
        'attempt.percentage',
        'attempt.status',
        'attempt.createdAt',
        'attempt.updatedAt',
      ])
      .where('attempt.id = :id', { id: saved.id })
      .getOne();
  }

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
