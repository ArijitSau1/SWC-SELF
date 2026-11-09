import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StudentAnswer } from './entities/student-answer.entity';
import { TestAttempt } from 'src/test-attempt/entities/test-attempt.entity';
import { Question } from 'src/question/entities/question.entity';
import { CreateStudentAnswerDto } from './dto/create-student-answer.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class StudentAnswerService {
  constructor(
    @InjectRepository(StudentAnswer)
    private readonly repo: Repository<StudentAnswer>,

    @InjectRepository(TestAttempt)
    private readonly testAttemptRepo: Repository<TestAttempt>,

    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async create(dto: CreateStudentAnswerDto, accountId: string) {
    const attempt = await this.testAttemptRepo.findOne({
      where: {
        id: dto.attemptId,
        account: { id: accountId },
      },
      relations: {
        mockTest: true,
      },
    });

    if (!attempt) {
      throw new NotFoundException('Test attempt not found');
    }

    if (attempt.status !== DefaultStatus.ACTIVE) {
      throw new BadRequestException('Test has already been submitted');
    }

    const question = await this.questionRepo.findOne({
      where: {
        id: dto.questionId,
        mockTest: { id: attempt.mockTest.id },
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const existing = await this.repo.findOne({
      where: {
        attempt: { id: dto.attemptId },
        question: { id: dto.questionId },
      },
    });

    if (existing) {
      throw new ConflictException('You have already answered this question');
    }

    const isCorrect = question.correct_option === dto.selected_option;

    const obj = Object.assign({
      ...dto,
      attempt: attempt,
      question: question,
      is_correct: isCorrect,
    });

    const saved = await this.repo.save(obj);

    return this.repo
      .createQueryBuilder('studentAnswer')
      .leftJoin('studentAnswer.question', 'question')
      .select([
        'studentAnswer.id',
        'studentAnswer.selected_option',
        'studentAnswer.is_correct',
        'studentAnswer.createdAt',
        'question.id',
      ])
      .where('studentAnswer.id = :id', { id: saved.id })
      .getOne();
  }

  async findAll(attemptId: string, accountId: string) {
    const attempt = await this.testAttemptRepo.findOne({
      where: {
        id: attemptId,
        account: { id: accountId },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Test attempt not found');
    }

    return this.repo
      .createQueryBuilder('studentAnswer')
      .leftJoin('studentAnswer.question', 'question')
      .select([
        'studentAnswer.id',
        'studentAnswer.selected_option',
        'studentAnswer.is_correct',
        'studentAnswer.createdAt',
        'question.id',
        'question.question',
        'question.options',
        'question.correct_option',
        'question.explanation',
      ])
      .where('studentAnswer.attemptId = :attemptId', { attemptId })
      .getMany();
  }
}
