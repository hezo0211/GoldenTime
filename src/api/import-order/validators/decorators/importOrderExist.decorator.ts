import { registerDecorator, ValidationOptions } from 'class-validator';
import {
  ImportOrderExistContraint,
  ImportOrderExistOptions,
} from '../importOrderExist.constraint';

export function ImportOrderExist(
  options?: ImportOrderExistOptions,
  validationOptions?: ValidationOptions,
) {
  return function (obj: Object, propName: string) {
    registerDecorator({
      propertyName: propName,
      target: obj.constructor,
      validator: ImportOrderExistContraint,
      options: validationOptions,
      constraints: [options],
    });
  };
}
