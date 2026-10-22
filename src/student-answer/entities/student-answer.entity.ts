
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TestAttempt } from 'src/test-attempt/entities/test-attempt.entity';
import { Question } from 'src/question/entities/question.entity';

@Entity('student_answer')
export class StudentAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  selected_option: string;

  @Column({ type: 'boolean', default: false })
  is_correct: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TestAttempt, (attempt) => attempt.studentAnswers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  attempt: TestAttempt;

  @ManyToOne(() => Question, (question) => question.studentAnswers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  question: Question;
}
