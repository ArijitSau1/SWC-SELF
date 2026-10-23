import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DefaultStatus, PaidOrFree } from 'src/enum';
import { Subject } from 'src/subject/entities/subject.entity';

@Entity('study_material')
export class StudyMaterial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pdf_file_url: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  pdf_file_path: string;

  @Column({ type: 'float', nullable: true })
  rating: number;

  @Column({ type: 'int', default: 0 })
  total_chapters: number;

  @Column({type: 'enum', enum: PaidOrFree, default: PaidOrFree.FREE})
  access_type: PaidOrFree;

  @Column({type: 'decimal',precision: 10,scale: 2,default: 0})
  price: number;

  @Column({type: 'enum',enum: DefaultStatus,default: DefaultStatus.ACTIVE})
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Subject, (subject) => subject.studyMaterials, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  subject: Subject;
}
