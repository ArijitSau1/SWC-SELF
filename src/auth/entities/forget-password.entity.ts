import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PasswordReset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', length: 100, nullable: true})
  email: string;

  @Column({type: 'varchar', length: 6, nullable: true})
  otp: string;

  @Column({nullable:true})
  expiresAt: Date;

  @Column({ default: false })
  verified: boolean;


  @CreateDateColumn()
  createdAt: Date;
}