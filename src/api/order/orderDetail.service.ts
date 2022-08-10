import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetail } from './entities/orderDetail.entity';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}
  async findById(id: string, shoesId: string): Promise<OrderDetail> {
    return await this.orderDetailRepository.findOne({
      where: { orderId: id, shoesId: shoesId },
    });
  }
  async update(value: OrderDetail): Promise<OrderDetail> {
    await this.orderDetailRepository.save(value);
    return value;
  }
  async deleteById(id: string, shoesId: string): Promise<void> {
    await this.orderDetailRepository.delete({
      shoesId: shoesId,
      orderId: id,
    });
  }
  getRepository(): Repository<OrderDetail> {
    return this.orderDetailRepository;
  }
}
