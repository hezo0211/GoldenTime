import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Exclude()
@Entity()
export class Category {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Expose()
  @Column({ length: 100 })
  categoryName: string;

  @Expose()
  @Column({ nullable: true })
  description: string;

  @Expose()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
