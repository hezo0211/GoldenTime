import { registerDecorator, ValidationOptions } from 'class-validator';
import {
  WatchExistConstraint,
  WatchExistOptions,
} from '../watchExist.constraint';

export function WatchExist(
  options?: WatchExistOptions,
  validationOptions?: ValidationOptions,
) {
  return function (obj: Object, propName: string) {
    registerDecorator({
      propertyName: propName,
      target: obj.constructor,
      validator: WatchExistConstraint,
      constraints: [options],
      options: validationOptions,
    });
  };
}
