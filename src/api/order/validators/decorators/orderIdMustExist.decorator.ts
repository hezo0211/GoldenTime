import { ValidatorOptions } from 'class-validator';
import { OrderExist } from './orderExist.decorator';

export function ImportOrderIdMustExist(options?: ValidatorOptions) {
  return OrderExist({ orderId: true }, options);
}
