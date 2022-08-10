import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  isDefined,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

export interface OrderExistOptions {
  orderId?: boolean;
}

@ValidatorConstraint({ async: true })
@Injectable()
export class OrderExistContraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const options = <OrderExistOptions>validationArguments.constraints[0];
    if (isDefined(options.orderId)) {
      const result = await this.orderRepository.count({
        where: { orderId: value },
      });
      if (options.orderId) return result > 0;
      return result == 0;
    }
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    const options = <OrderExistOptions>validationArguments.constraints[0];
    if (options.orderId === true) return 'Đơn hàng không tồn tại';
    if (options.orderId === false) return 'Đơn hàng đã tồn tại';
  }
}
