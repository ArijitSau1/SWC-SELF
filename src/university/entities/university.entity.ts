import { DegreeUniversity } from 'src/degree-university/entities/degree-university.entity';
import { DefaultStatus } from 'src/enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('university')
export class University {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  name: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => DegreeUniversity,
    (degreeUniversity) => degreeUniversity.university,
  )
  degreeUniversities: DegreeUniversity[];
}
