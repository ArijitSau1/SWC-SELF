import { DefaultStatus, Gender, UserRole } from 'src/enum';
import { TestAttempt } from 'src/test-attempt/entities/test-attempt.entity';
import { UserPermission } from 'src/user-permissions/entities/user-permission.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'varchar', length: 255, nullable: true })
  institution: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  profileImageUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  profileImagePath: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  roles: UserRole;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TestAttempt, (testAttempt) => testAttempt.account)
  testAttempts: TestAttempt[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.account)
  userPermission: UserPermission[];
}
