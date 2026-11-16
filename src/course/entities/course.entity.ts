import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Subject } from 'src/subject/entities/subject.entity';
import { StudyMaterial } from 'src/study-material/entities/study-material.entity';
import { MockTest } from 'src/mock-test/entities/mock-test.entity';
import { AudioLecture } from 'src/audio-lecture/entities/audio-lecture.entity';
import { VideoLecture } from 'src/video-lecture/entities/video-lecture.entity';
import { DefaultStatus, PaidOrFree } from 'src/enum';
import { CourseEnrollment } from 'src/course-enrollment/entities/course-enrollment.entity';

@Entity('course')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'enum', enum: PaidOrFree, default: PaidOrFree.FREE })
  access_type: PaidOrFree;

  @Column({ type: 'int', nullable: true })
  price: number;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Subject, (subject) => subject.courses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  subject: Subject;

  @OneToMany(() => StudyMaterial, (studyMaterial) => studyMaterial.course)
  studyMaterials: StudyMaterial[];

  @OneToMany(() => MockTest, (mockTest) => mockTest.course)
  mockTests: MockTest[];

  @OneToMany(() => AudioLecture, (audioLecture) => audioLecture.course)
  audioLectures: AudioLecture[];

  @OneToMany(() => VideoLecture, (videoLecture) => videoLecture.course)
  videoLectures: VideoLecture[];

  @OneToMany(
    () => CourseEnrollment,
    (courseEnrollment) => courseEnrollment.course,
  )
  courseEnrollments: CourseEnrollment[];
}
