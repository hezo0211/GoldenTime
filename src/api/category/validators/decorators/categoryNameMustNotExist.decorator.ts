import { ValidationOptions } from 'class-validator';
import { CategoryExist } from './categoryExist.decorator';

export function CategoryNameMustNotExist(options?: ValidationOptions) {
  return CategoryExist({ categoryName: false }, options);
}
