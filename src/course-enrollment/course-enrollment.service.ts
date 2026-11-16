import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { CourseEnrollment } from './entities/course-enrollment.entity';
import { Course } from 'src/course/entities/course.entity';
import {  PaidOrFree } from 'src/enum';
import { CreateCourseEnrollmentDto } from './dto/create-course-enrollment.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';

@Injectable()
export class CourseEnrollmentService {
  constructor(
    @InjectRepository(CourseEnrollment)
    private readonly repo: Repository<CourseEnrollment>,

    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async enroll(accountId: string, dto: CreateCourseEnrollmentDto) {
  const course = await this.courseRepo.findOne({
    where: { id: dto.courseId },
  });

  if (!course) {
    throw new NotFoundException('Course not found');
  }

  if (course.access_type === PaidOrFree.PAID) {
    return {
      message: 'This is a paid course. Please purchase this course.',
      access_type: course.access_type,
      price: course.price,
    };
  }

  const existing = await this.repo.findOne({
    where: {
      account: { id: accountId },
      course: { id: dto.courseId },
    },
  });

  if (existing) {
    throw new BadRequestException('Already enrolled');
  }

  const obj = Object.assign({
    account: { id: accountId },
    course: { id: dto.courseId },
  });

  const result = await this.repo.save(obj);

  return {
    message: 'Successfully enrolled in free course',
    result,
  };
}

async myCourses(accountId: string, dto: DefaultStatusPaginationDto) {
  const keyword = dto.keyword || '';

  const [result, count] = await this.repo
    .createQueryBuilder('courseEnrollment')
    .leftJoinAndSelect('courseEnrollment.course', 'course')
    .leftJoinAndSelect('course.subject', 'subject')
    .where('courseEnrollment.accountId = :accountId', {
      accountId: accountId,
    })
    .andWhere('courseEnrollment.status = :status', {
      status: dto.status,
    })
    .andWhere(
      new Brackets((qb) => {
        qb.where(
          'course.title LIKE :title OR subject.name LIKE :name',
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
