
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

@Entity('video_lecture')
export class VideoLecture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable:true })
  title: string;


  @Column({ type: 'varchar', length: 255, nullable:true })
  video_url: string;

  @Column({ type: 'int', default: 0 })
  duration: number;

  @Column({type: 'enum',enum: PaidOrFree,default: PaidOrFree.FREE})
  access_type: PaidOrFree;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({type: 'enum',enum: DefaultStatus,default: DefaultStatus.ACTIVE})
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Subject, (subject) => subject.videoLectures, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  subject: Subject;
}
