import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ClassTierEnum, DefaultStatus } from 'src/enum';
import { Board } from 'src/board/entities/board.entity';
import { Stream } from 'src/stream/entities/stream.entity';
import { Subject } from 'src/subject/entities/subject.entity';

@Entity('school_class')
export class SchoolClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'enum', enum: ClassTierEnum, nullable: true })
  tier: ClassTierEnum;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Board, (board) => board.schoolClasses, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  board: Board;

  @OneToMany(() => Stream, (stream) => stream.schoolClass)
  streams: Stream[];

  @OneToMany(() => Subject, (subject) => subject.schoolClass)
  subjects: Subject[];
}
