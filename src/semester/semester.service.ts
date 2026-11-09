import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';
import { Brackets, Repository } from 'typeorm';

import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';
import { Stream } from 'src/stream/entities/stream.entity';
import { DegreeUniversity } from 'src/degree-university/entities/degree-university.entity';
import { CreateSemesterDto } from './dto/create-semester.dto';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(Semester)
    private readonly repo: Repository<Semester>,

    @InjectRepository(Stream)
    private readonly streamRepo: Repository<Stream>,

    @InjectRepository(DegreeUniversity)
    private readonly degreeUniversityRepo: Repository<DegreeUniversity>,
  ) {}

  async create(dto: CreateSemesterDto) {
  let stream: Stream | null = null;
  let degreeUniversity: DegreeUniversity | null = null;

  if (dto.streamId) {
    stream = await this.streamRepo.findOne({
      where: { id: dto.streamId },
    });

    if (!stream) {
      throw new NotFoundException('Stream not found');
    }
  }

  if (dto.degreeUniversityId) {
    degreeUniversity = await this.degreeUniversityRepo.findOne({
      where: { id: dto.degreeUniversityId },
    });

    if (!degreeUniversity) {
      throw new NotFoundException('Degree University not found');
    }
  }

  const obj = Object.assign({...dto,stream:stream,degreeUniversity:degreeUniversity})
  return this.repo.save(obj);
}

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';

    const [result, count] = await this.repo
      .createQueryBuilder('semester')
      .leftJoinAndSelect('semester.stream', 'stream')
      .where('semester.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where('semester.name LIKE :name', {
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
    const semester = await this.repo.findOne({ where: { id } });
    if (!semester) {
      throw new NotFoundException('Semester not found');
    }
    const obj = Object.assign(semester, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}
