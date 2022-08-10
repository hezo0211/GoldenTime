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
import { Exclude, Expose } from 'class-transformer';
import { Gender } from '../enums/gender';

@Exclude()
@Entity()
export class User {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Expose()
  @Column({
    length: 65,
  })
  username: string;

  @Column()
  @Expose({ toClassOnly: true })
  password: string;

  @Expose()
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

  @Expose()
  @Column({
    default: false,
  })
  isActive: boolean;

  @Expose()
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Expose()
  @Column({ length: 35 })
  firstName: string;

  @Expose()
  @Column({ length: 100 })
  lastName: string;

  @Expose()
  @Column({ length: 30 })
  phoneNumber: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.None,
  })
  gender: string;

  @Expose()
  @Column({ length: 35 })
  city: string;

  @Expose()
  @Column({ length: 75 })
  district: string;

  @Expose()
  @Column({ length: 255 })
  address: string;

  @Expose()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
