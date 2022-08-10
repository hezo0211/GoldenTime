import { ValidationOptions } from 'class-validator';
import { BrandExist } from './brandExist.decorator';

export function BrandNameMustNotExist(options?: ValidationOptions) {
  return BrandExist({ brandName: false }, options);
}
