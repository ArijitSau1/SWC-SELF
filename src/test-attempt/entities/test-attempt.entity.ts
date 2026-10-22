import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Account } from 'src/account/entities/account.entity';
import { MockTest } from 'src/mock-test/entities/mock-test.entity';
import { StudentAnswer } from 'src/student-answer/entities/student-answer.entity';

@Entity('test_attempt')
export class TestAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  total_questions: number;

  @Column({ type: 'int', default: 0 })
  correct: number;

  @Column({ type: 'int', default: 0 })
  wrong: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentage: number;

  @Column({ type: 'datetime', nullable: true })
  submitted_at: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.testAttempts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account;

  @ManyToOne(() => MockTest, (mockTest) => mockTest.testAttempts, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  mockTest: MockTest;

  @OneToMany(() => StudentAnswer, (answer) => answer.attempt)
  studentAnswers: StudentAnswer[];
}
