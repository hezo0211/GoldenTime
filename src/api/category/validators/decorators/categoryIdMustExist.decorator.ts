import { ValidationOptions } from 'class-validator';
import { CategoryExist } from './categoryExist.decorator';

export function CategoryIdMustExist(options?: ValidationOptions) {
  return CategoryExist({ categoryId: true }, options);
}
