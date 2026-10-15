import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { DegreeUniversity } from './entities/degree-university.entity';
import { Degree } from 'src/degree/entities/degree.entity';
import { University } from 'src/university/entities/university.entity';
import { CreateDegreeUniversityDto } from './dto/create-degree-university.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class DegreeUniversityService {
  constructor(
    @InjectRepository(DegreeUniversity)
    private readonly repo: Repository<DegreeUniversity>,

    @InjectRepository(Degree)
    private readonly degreeRepo: Repository<Degree>,

    @InjectRepository(University)
    private readonly universityRepo: Repository<University>,
  ) {}

  async create(dto: CreateDegreeUniversityDto) {
    const degree = await this.degreeRepo.findOne({
      where: { id: dto.degreeId },
    });

    if (!degree) {
      throw new NotFoundException('Degree not found');
    }

    const university = await this.universityRepo.findOne({
      where: { id: dto.universityId },
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    const existing = await this.repo.findOne({
      where: {
        degree: { id: dto.degreeId },
        university: { id: dto.universityId },
      },
    });

    if (existing) {
      throw new ConflictException(
        'This degree is already associated with this university',
      );
    }
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, count] = await this.repo
      .createQueryBuilder('degreeUniversity')
      .leftJoinAndSelect('degreeUniversity.degree', 'degree')
      .leftJoinAndSelect('degreeUniversity.university', 'university')
      .where('degreeUniversity.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where('degree.name LIKE :name or university.name LIKE :name ', {
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
    const degreeUniversity = await this.repo.findOne({ where: { id } });
    if (!degreeUniversity) {
      throw new NotFoundException('User not found!');
    }
    const obj = Object.assign(degreeUniversity, {
      status: DefaultStatus.DELETED,
    });
    return this.repo.save(obj);
  }
}
