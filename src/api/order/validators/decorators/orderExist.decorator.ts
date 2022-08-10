import { registerDecorator, ValidationOptions } from 'class-validator';
import {
  OrderExistContraint,
  OrderExistOptions,
} from '../orderExist.constraint';

export function OrderExist(
  options?: OrderExistOptions,
  validationOptions?: ValidationOptions,
) {
  return function (obj: Object, propName: string) {
    registerDecorator({
      propertyName: propName,
      target: obj.constructor,
      validator: OrderExistContraint,
      options: validationOptions,
      constraints: [options],
    });
  };
}
