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

@Entity('mock_test')
export class MockTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title: string;

  @Column({ type: 'int', default: 0 })
  total_questions: number;

  @Column({ type: 'int', default: 0 })
  total_marks: number;

  @Column({ type: 'enum', enum: PaidOrFree, default: PaidOrFree.FREE })
  access_type: PaidOrFree;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Subject, (subject) => subject.mockTests, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  subject: Subject;
}
