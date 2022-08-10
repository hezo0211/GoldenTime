import { Exclude, Expose } from 'class-transformer';
import { Brand } from 'src/api/brand/entities/brand.entity';
import { Category } from 'src/api/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Exclude()
export class Watch {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  watchId: string;

  @Expose()
  @Column({ length: 100 })
  watchName: string;

  @Expose()
  @Column({ nullable: true, type: 'text' })
  description: string;

  @Expose()
  @Column()
  watchImage: string;

  @Expose()
  @Column({ length: 20 })
  SKU: string;

  @Expose()
  @ManyToMany(() => Category)
  @JoinTable({ name: 'classification' })
  categories: Category[];

  @Expose()
  @ManyToOne(() => Brand, { onDelete: 'SET NULL' })
  @JoinColumn()
  brand: Brand;

  @Expose()
  @Column({ type: 'decimal' })
  price: number;

  @Expose()
  @Column({ type: 'decimal' })
  importPrice: number;

  @Expose()
  @Column({ type: 'decimal' })
  sale: number;

  @Expose()
  @Column({ default: 0 })
  quantity: number;

  @Expose()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
