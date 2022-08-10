import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/api/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ImportOrderDetail } from './importOrderDetail.entity';

@Exclude()
@Entity()
export class ImportOrder {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  importOrderId: string;

  @Expose()
  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;

  @Expose()
  @Column({ nullable: true })
  note: string;

  @Expose()
  @OneToMany(
    () => ImportOrderDetail,
    (importOrderDetail) => importOrderDetail.importOrder,
    { cascade: true },
  )
  details: ImportOrderDetail[];

  @Expose()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
