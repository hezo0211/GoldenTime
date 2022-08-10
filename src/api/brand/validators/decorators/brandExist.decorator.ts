import { registerDecorator, ValidationOptions } from 'class-validator';
import {
  BrandExistContraint,
  BrandExistOptions,
} from '../brandExist.contraint';

export function BrandExist(
  options?: BrandExistOptions,
  validationOptions?: ValidationOptions,
) {
  return function (obj: Object, propName: string) {
    registerDecorator({
      propertyName: propName,
      target: obj.constructor,
      validator: BrandExistContraint,
      options: validationOptions,
      constraints: [options],
    });
  };
}
