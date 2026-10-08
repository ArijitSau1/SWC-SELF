
import { DefaultStatus, UserRole } from 'src/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'; 

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type:'text',nullable: true})
  name:string

  @Column({type:'varchar',nullable:true})
  email:string


  @Column({ type: 'text', nullable: true })
  password: string;


  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  roles: UserRole;


  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}

