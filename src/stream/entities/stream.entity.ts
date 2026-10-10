import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { SchoolClass } from '../../school-class/entities/school-class.entity';
import { DefaultStatus } from 'src/enum';
import { Semester } from 'src/semester/entities/semester.entity';

@Entity('stream')
export class Stream {
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

    @ManyToOne(() => SchoolClass, (schoolClass) => schoolClass.streams, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  schoolClass: SchoolClass;

  @OneToMany(() => Semester, (semester) => semester.stream)
  semesters: Semester[];
}
