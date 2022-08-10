import { Exclude, Expose } from 'class-transformer';
import { Watch } from 'src/api/watch/entities/watch.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ImportOrder } from './importOrder.entity';

@Exclude()
@Entity()
export class ImportOrderDetail {
  @Expose()
  @PrimaryColumn('uuid')
  importOrderId: string;

  @Expose()
  @PrimaryColumn('uuid')
  shoesId: string;

  @Expose()
  @ManyToOne(() => ImportOrder, (importOrder) => importOrder.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'importOrderId',
  })
  importOrder: ImportOrder;

  @Expose()
  @ManyToOne(() => Watch)
  @JoinColumn({
    name: 'shoesId',
  })
  shoes: Watch;

  @Expose()
  @Column()
  quantity: number;
}
