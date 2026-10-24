import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompetitiveExam } from './entities/competitive-exam.entity';
import { Brackets, Repository } from 'typeorm';
import { CompetitiveCategory } from 'src/competitive-category/entities/competitive-category.entity';
import { CreateCompetitiveExamDto } from './dto/create-competitive-exam.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class CompetitiveExamService {
  constructor(
    @InjectRepository(CompetitiveExam)
    private readonly repo: Repository<CompetitiveExam>,
    @InjectRepository(CompetitiveCategory)
    private readonly categoryRepo: Repository<CompetitiveCategory>,
  ) {}

    async create(dto: CreateCompetitiveExamDto) {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Competitive category not found');
    }

    const existing = await this.repo.findOne({
      where: {
        name: dto.name,
        category: { id: dto.categoryId },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Exam already exists in this category',
      );
    }
}


async findAll(dto: DefaultStatusPaginationDto) {
  const keyword = dto.keyword || '';
  const [result, count] = await this.repo
    .createQueryBuilder('competitiveExam')
    .leftJoinAndSelect('competitiveExam.category', 'category')
    .where('competitiveExam.status = :status', {status: dto.status, })
    .andWhere(
      new Brackets((qb) => {
        qb.where(
          'competitiveExam.name LIKE :name OR category.name LIKE :category',
          {
            name: '%' + keyword + '%',
            category: '%' + keyword + '%',
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

  async remove(id: string) {
      const competitiveExam = await this.repo.findOne({ where: { id } });
      if (!competitiveExam) {
        throw new NotFoundException('competitive Exam not found');
      }
      const obj = Object.assign(competitiveExam, { status: DefaultStatus.DELETED });
      return this.repo.save(obj);
    }
}
