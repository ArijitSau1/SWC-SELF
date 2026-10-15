import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MockTest } from './entities/mock-test.entity';
import { Brackets, Repository } from 'typeorm';
import { Subject } from 'src/subject/entities/subject.entity';
import { CreateMockTestDto } from './dto/create-mock-test.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';

@Injectable()
export class MockTestService {
    constructor(
    @InjectRepository(MockTest) private readonly repo: Repository<MockTest>,
    @InjectRepository(Subject) private readonly subjectRepo: Repository<Subject>,
    ){}

     async create(dto: CreateMockTestDto) {
    const subject = await this.subjectRepo.findOne({
      where: { id: dto.subjectId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    const existing = await this.repo.findOne({
      where: {
        title: dto.title ,
        subject: { id: dto.subjectId },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Mock test with this title already exists for this subject',
      );
    }
}


  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, count] = await this.repo
      .createQueryBuilder('mock-test')
      .leftJoinAndSelect('mock-test.subject', 'subject')
      .where('mock-test.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'mock-test.title LIKE :title or subject.name LIKE :name ',
            {
              title: '%' + keyword + '%',
              name: '%' + keyword + '%',
            },
          );
        }),
      )
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, count };
  }
}
