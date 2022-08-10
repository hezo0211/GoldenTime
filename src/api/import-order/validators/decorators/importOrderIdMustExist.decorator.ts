import { ValidatorOptions } from 'class-validator';
import { ImportOrderExist } from './importOrderExist.decorator';

export function ImportOrderIdMustExist(options?: ValidatorOptions) {
  return ImportOrderExist({ importOrderId: true }, options);
}
