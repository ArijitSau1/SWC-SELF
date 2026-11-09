import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { Brackets, Repository } from 'typeorm';
import { SchoolClass } from 'src/school-class/entities/school-class.entity';
import { Semester } from 'src/semester/entities/semester.entity';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { CompetitiveExam } from 'src/competitive-exam/entities/competitive-exam.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly repo: Repository<Subject>,

    @InjectRepository(SchoolClass)
    private readonly schoolClassRepo: Repository<SchoolClass>,

    @InjectRepository(Semester)
    private readonly semesterRepo: Repository<Semester>,

    @InjectRepository(CompetitiveExam)
    private readonly examRepo: Repository<CompetitiveExam>,
  ) {}

  async create(dto: CreateSubjectDto) {
    let schoolClass: SchoolClass | null = null;
    let semester: Semester | null = null;
    let competitiveExam: CompetitiveExam | null = null;

    if (dto.schoolClassId) {
      schoolClass = await this.schoolClassRepo.findOne({
        where: { id: dto.schoolClassId },
      });

      if (!schoolClass) {
        throw new NotFoundException('School class not found');
      }
    }

    if (dto.semesterId) {
      semester = await this.semesterRepo.findOne({
        where: { id: dto.semesterId },
      });

      if (!semester) {
        throw new NotFoundException('Semester not found');
      }
    }

    if (dto.competitiveExamId) {
      competitiveExam = await this.examRepo.findOne({
        where: { id: dto.competitiveExamId },
      });

      if (!competitiveExam) {
        throw new NotFoundException('Competitive exam not found');
      }
    }

    const subject = Object.create({
      ...dto,
      schoolClass: schoolClass,
      semester: semester,
      competitiveExam: competitiveExam,
    });

    return this.repo.save(subject);
  }

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
      throw new NotFoundException('Subject not found');
    }
    const obj = Object.assign(subject, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}
