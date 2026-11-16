import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Brackets, Repository } from 'typeorm';
import { Subject } from 'src/subject/entities/subject.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly repo: Repository<Course>,

    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
  ) {}

  async create(dto: CreateCourseDto) {
    const subject = await this.subjectRepo.findOne({
      where: { id: dto.subjectId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found!');
    }

    const course = await this.repo.findOne({
      where: {
        title: dto.title,
        subject: { id: dto.subjectId },
      },
    });

    if (course) {
      throw new NotAcceptableException(
        'Course already exists for this subject!',
      );
    }

    const obj = Object.assign({ ...dto, subject: subject });

    const result = await this.repo.save(obj);

    return this.repo
      .createQueryBuilder('course')
      .leftJoin('course.subject', 'subject')
      .select([
        'course.id',
        'course.title',
        'course.access_type',
        'course.price',
        'course.rating',
        'course.reviewCount',
        'course.status',
        'course.createdAt',
        'subject.id',
        'subject.name',
      ])
      .where('course.id = :id', { id: result.id })
      .getOne();
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';

    const [result, count] = await this.repo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.subject', 'subject')
      .where('course.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where('course.title LIKE :title OR subject.name LIKE :name', {
            title: '%' + keyword + '%',
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
    const course = await this.repo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.subject', 'subject')
      .where('course.id = :id', { id: id })
      .getOne();

    if (!course) {
      throw new NotFoundException('Course not found!');
    }

    return course;
  }

  async remove(id: string) {
    const course = await this.repo.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const obj = Object.assign(course, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}
