import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';
import { Brackets, Repository } from 'typeorm';

import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';
import { Stream } from 'src/stream/entities/stream.entity';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(Semester)
    private readonly repo: Repository<Semester>,

    @InjectRepository(Stream)
    private readonly streamRepo: Repository<Stream>,
  ) {}

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
      throw new NotFoundException('User not found!');
    }
    const obj = Object.assign(semester, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}
