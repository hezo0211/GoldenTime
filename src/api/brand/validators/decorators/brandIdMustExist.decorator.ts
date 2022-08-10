import { ValidationOptions } from 'class-validator';
import { BrandExist } from './brandExist.decorator';

export function BrandIdMustExist(options?: ValidationOptions) {
  return BrandExist({ brandId: true }, options);
}
