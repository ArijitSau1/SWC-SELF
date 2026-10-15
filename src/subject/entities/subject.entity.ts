import { AudioLecture } from 'src/audio-lecture/entities/audio-lecture.entity';
import { DefaultStatus } from 'src/enum';
import { MockTest } from 'src/mock-test/entities/mock-test.entity';
import { SchoolClass } from 'src/school-class/entities/school-class.entity';
import { Semester } from 'src/semester/entities/semester.entity';
import { StudyMaterial } from 'src/study-material/entities/study-material.entity';
import { VideoLecture } from 'src/video-lecture/entities/video-lecture.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('subject')
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => SchoolClass, (schoolClass) => schoolClass.subjects, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  schoolClass: SchoolClass | null;

  @ManyToOne(() => Semester, (semester) => semester.subjects, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  semester: Semester | null;

  @OneToMany(() => StudyMaterial, (studyMaterial) => studyMaterial.subject)
  studyMaterials: StudyMaterial[];

  @OneToMany(() => VideoLecture, (videoLecture) => videoLecture.subject)
  videoLectures: VideoLecture[];

  @OneToMany(() => AudioLecture, (audioLecture) => audioLecture.subject)
  audioLectures: AudioLecture[];

  @OneToMany(() => MockTest, (mockTest) => mockTest.subject)
  mockTests: MockTest[];
}
