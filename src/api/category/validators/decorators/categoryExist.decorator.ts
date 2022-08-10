import { registerDecorator, ValidationOptions } from 'class-validator';
import {
  CategoryExistContraint,
  CategoryExistOptions,
} from '../categoryExist.constraint';

export function CategoryExist(
  options?: CategoryExistOptions,
  validationOptions?: ValidationOptions,
) {
  return function (obj: Object, propName: string) {
    registerDecorator({
      propertyName: propName,
      target: obj.constructor,
      validator: CategoryExistContraint,
      constraints: [options],
      options: validationOptions,
    });
  };
}
