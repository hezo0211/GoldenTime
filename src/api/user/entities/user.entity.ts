import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/api/auth/enums/role.enum';
import { Exclude } from 'class-transformer';
import { Gender } from '../enums/gender';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({
    length: 65,
  })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    length: 255,
  })
  email: string;

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  @BeforeUpdate()
  checkPasswordHash() {
    const pattern = /^\$2[ayb]\$.{56}$/g;
    if (this.password.match(pattern)) return;
    this.hashPassword();
  }

  @Column({
    default: false,
  })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Column({ length: 35 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 30 })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.None,
  })
  gender: string;

  @Column({ length: 35 })
  city: string;

  @Column({ length: 75 })
  district: string;

  @Column({ length: 255 })
  address: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
