import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DefaultStatus, PaidOrFree } from 'src/enum';
import { Subject } from 'src/subject/entities/subject.entity';
import { Question } from 'src/question/entities/question.entity';
import { TestAttempt } from 'src/test-attempt/entities/test-attempt.entity';

@Entity('mock_test')
export class MockTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  class_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  semester_name: string;

  @Column({ type: 'int', default: 0 })
  total_questions: number;

  @Column({ type: 'int', default: 0 })
  duration: number;

  @Column({ type: 'int', default: 0 })
  total_marks: number;

  @Column({ type: 'enum', enum: PaidOrFree, default: PaidOrFree.FREE })
  access_type: PaidOrFree;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Subject, (subject) => subject.mockTests, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  subject: Subject;

  @OneToMany(() => Question, (question) => question.mockTest)
  questions: Question[];

  @OneToMany(() => TestAttempt, (testAttempt) => testAttempt.mockTest)
  testAttempts: TestAttempt[];
}
