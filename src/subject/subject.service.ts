import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { Brackets, Repository } from 'typeorm';
import { SchoolClass } from 'src/school-class/entities/school-class.entity';
import { Semester } from 'src/semester/entities/semester.entity';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly repo: Repository<Subject>,

    @InjectRepository(SchoolClass)
    private readonly schoolClassRepo: Repository<SchoolClass>,

    @InjectRepository(Semester)
    private readonly semesterRepo: Repository<Semester>,
  ) {}

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';

    const [result, count] = await this.repo
      .createQueryBuilder('subject')
      .leftJoinAndSelect('subject.schoolClass', 'schoolClass')
      .leftJoinAndSelect('subject.semester', 'semester')
      .where('subject.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where('subject.name LIKE :name', {
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
    const subject = await this.repo.findOne({ where: { id } });
    if (!subject) {
      throw new NotFoundException('Subject not found!');
    }
    const obj = Object.assign(subject, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}
