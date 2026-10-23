import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CompetitiveExam } from 'src/competitive-exam/entities/competitive-exam.entity';
import { DefaultStatus } from 'src/enum';

@Entity('competitive_category')
export class CompetitiveCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => CompetitiveExam,
    (competitiveExam) => competitiveExam.category,
  )
  competitiveExams: CompetitiveExam[];
}
