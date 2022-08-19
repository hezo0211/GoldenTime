import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/api/user/entities/user.entity';
import { Gender } from 'src/api/user/enums/gender';
import { VirtualColumn } from 'src/shared/decorators/virtualColumn/virtualColumn.decorator';
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
import { OrderStatus } from '../enums/orderStatus.enum';
import { PaymentMethod } from '../enums/paymentMedthod.enum';
import { OrderDetail } from './orderDetail.entity';

@Exclude()
@Entity()
export class Order {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @Expose()
  @ManyToOne(() => User)
  @JoinColumn()
  owner: User;

  @Expose()
  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Expose()
  @VirtualColumn({
    name: 'total_price',
  })
  totalPrice: number;

  @Expose()
  @Column({
    length: 25,
  })
  postCode: string;

  @Expose()
  @Column({ nullable: true })
  note?: string;

  @Expose()
  @Column({ length: 35 })
  orderFirstName: string;

  @Expose()
  @Column({ length: 100 })
  orderLastName: string;

  @Expose()
  @Column({ length: 30 })
  orderPhoneNumber: string;

  @Expose()
  @Column({ nullable: true })
  orderEmail?: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: Gender,
  })
  orderGender: Gender;

  @Expose()
  @Column({ length: 35 })
  orderCity: string;

  @Expose()
  @Column({ length: 75 })
  orderDistrict: string;

  @Expose()
  @Column()
  orderAddress: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Expose()
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  details: OrderDetail[];

  @Expose()
  @Column({ nullable: true })
  onlinePaymentId?: string;

  @Expose()
  @Column({ type: 'timestamp', nullable: true })
  datePurchased?: Date;

  @Expose()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
