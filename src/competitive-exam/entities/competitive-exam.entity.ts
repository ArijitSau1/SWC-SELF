
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DefaultStatus } from 'src/enum';
import { CompetitiveCategory } from 'src/competitive-category/entities/competitive-category.entity';
import { Subject } from 'src/subject/entities/subject.entity';

@Entity('competitive_exam')
export class CompetitiveExam {
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

  @ManyToOne(() => CompetitiveCategory,(category) => category.competitiveExams,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  category: CompetitiveCategory;

  @OneToMany(() => Subject, (subject) => subject.competitiveExam)
  subjects: Subject[];
}
