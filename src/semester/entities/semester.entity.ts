import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { DefaultStatus } from 'src/enum';
import { Stream } from 'src/stream/entities/stream.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { DegreeUniversity } from 'src/degree-university/entities/degree-university.entity';

@Entity('semester')
export class Semester {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100,nullable:true })
  name: string;

  @Column({type: 'enum',enum: DefaultStatus,default: DefaultStatus.ACTIVE,})
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Stream, (stream) => stream.semesters, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  stream: Stream;

  @OneToMany(() => Subject, (subject) => subject.semester)
  subjects: Subject[];


  @ManyToOne(
  () => DegreeUniversity,
  (degreeUniversity) => degreeUniversity.semesters,
  {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
)
degreeUniversity: DegreeUniversity;
}