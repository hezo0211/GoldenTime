import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
@Entity()
export class Brand {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  brandId: string;

  @Expose()
  @Column({ length: 100 })
  brandName: string;
}
