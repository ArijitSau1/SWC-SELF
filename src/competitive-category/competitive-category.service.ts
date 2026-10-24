import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CompetitiveCategory } from './entities/competitive-category.entity';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompetitiveCategoryDto } from './dto/create-competitive-category.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class CompetitiveCategoryService {
  constructor(
    @InjectRepository(CompetitiveCategory)
    private readonly repo: Repository<CompetitiveCategory>,
  ) {}

  async create(dto: CreateCompetitiveCategoryDto) {
    const competitiveCategory = await this.repo.findOne({
      where: { name: dto.name },
    });

    if (competitiveCategory) {
      throw new ConflictException('Competitive Catagory already exists');
    }

    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, count] = await this.repo
      .createQueryBuilder('competitiveCatagory')
      .where('competitiveCatagory.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where('competitiveCatagory.name LIKE :name  ', {
            name: '%' + keyword + '%',
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

  async remove(id: string) {
      const competitiveCatagory = await this.repo.findOne({ where: { id } });
      if (!competitiveCatagory) {
        throw new NotFoundException('competitive catagory not found');
      }
      const obj = Object.assign(competitiveCatagory, { status: DefaultStatus.DELETED });
      return this.repo.save(obj);
    }
}
