import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DefaultStatus } from 'src/enum';
import { Account } from 'src/account/entities/account.entity';
import { Course } from 'src/course/entities/course.entity';

@Entity('course_enrollment')
export class CourseEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DefaultStatus,
    default: DefaultStatus.ACTIVE,
  })
  status: DefaultStatus;

  @CreateDateColumn()
  enrolledAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.courseEnrollments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account;

  @ManyToOne(() => Course, (course) => course.courseEnrollments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  course: Course;
}