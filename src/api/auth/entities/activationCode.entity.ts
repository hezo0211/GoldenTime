import { isEmpty } from 'class-validator';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccessAction } from '../enums/accessAction.enum';

@Entity()
export class ActivationCode {
  @PrimaryGeneratedColumn('uuid')
  activationCodeId: string;

  @Column()
  email: string;

  @Column({ length: 6 })
  code: string;

  @Column({
    type: 'enum',
    enum: AccessAction,
    default: AccessAction.NONE,
  })
  action: AccessAction;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
  })
  expiredAt: Date;

  @BeforeInsert()
  createRandomCode() {
    if (!isEmpty(this.code)) return;
    this.code = Math.random().toString().slice(2, 8);
  }
}
