import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MockTest } from 'src/mock-test/entities/mock-test.entity';
import { DefaultStatus } from 'src/enum';
import { StudentAnswer } from 'src/student-answer/entities/student-answer.entity';

@Entity('question')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  question: string;

  @Column({ type: 'json', nullable: true })
  options: string[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  correct_option: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => MockTest, (mockTest) => mockTest.questions, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  mockTest: MockTest;

  @OneToMany(() => StudentAnswer, (answer) => answer.question)
  studentAnswers: StudentAnswer[];
}
