import { Injectable, NotFoundException } from '@nestjs/common';
import { Question } from './entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { MockTest } from 'src/mock-test/entities/mock-test.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly repo: Repository<Question>,

    @InjectRepository(MockTest)
    private readonly mockTestRepo: Repository<MockTest>,
  ) {}

  async create(dto: CreateQuestionDto) {
    const mockTest = await this.mockTestRepo.findOne({
      where: { id: dto.mockTestId },
    });

    if (!mockTest) {
      throw new NotFoundException('Mock test not found');
    }

    const obj = Object.assign({
      ...dto,
      mockTest: mockTest,
    });

    const saved = await this.repo.save(obj);

    return this.repo
      .createQueryBuilder('question')
      .leftJoin('question.mockTest', 'mockTest')
      .select([
        'question.id',
        'question.question',
        'question.options',
        'question.correct_option',
        'question.explanation',
        'question.status',
        'question.createdAt',
      ])
      .where('question.id = :id', { id: saved.id })
      .getOne();
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, count] = await this.repo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.mockTest', 'mockTest')
      .where('question.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'question.question LIKE :question OR mockTest.title LIKE :title ',
            {
              question: '%' + keyword + '%',
              title: '%' + keyword + '%',
            },
          );
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

  async findByMockTest(mockTestId: string) {
    const result = await this.repo
      .createQueryBuilder('question')
      .where('question.mockTestId = :mockTestId', { mockTestId })
      .andWhere('question.status = :status', { status: DefaultStatus.ACTIVE })
      .select(['question.id', 'question.question', 'question.options'])
      .getMany();

    return result;
  }

  async remove(id: string) {
    const question = await this.repo.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    const obj = Object.assign(Question, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}
