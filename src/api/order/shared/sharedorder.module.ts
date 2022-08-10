import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderDetail } from '../entities/orderDetail.entity';
import { OrderService } from '../order.service';
import { OrderDetailService } from '../orderDetail.service';
import { OrderExistContraint } from '../validators/orderExist.constraint';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail])],
  providers: [OrderService, OrderDetailService, OrderExistContraint],
  exports: [OrderService, OrderDetailService, OrderExistContraint],
})
export class SharedOrderModule {}
