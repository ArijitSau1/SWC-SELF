import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DefaultStatus } from 'src/enum';
import { Stream } from 'src/stream/entities/stream.entity';

@Entity('semester')
export class Semester {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100,nullable:true })
  name: string;

  @Column({type: 'enum',enum: DefaultStatus,default: DefaultStatus.ACTIVE,})
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Stream, (stream) => stream.semesters, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  stream: Stream;
}