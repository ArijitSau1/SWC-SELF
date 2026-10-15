import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { DefaultStatus } from 'src/enum';
import { Degree } from 'src/degree/entities/degree.entity';
import { University } from 'src/university/entities/university.entity';
import { Semester } from 'src/semester/entities/semester.entity';

@Entity('degree_university')
export class DegreeUniversity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Degree, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  degree: Degree;

  @ManyToOne(() => University, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  university: University;

  @OneToMany(() => Semester, (semester) => semester.degreeUniversity)
  semesters: Semester[];
}
