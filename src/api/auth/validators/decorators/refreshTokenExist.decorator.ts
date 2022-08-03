import { registerDecorator, ValidationOptions } from 'class-validator';
import {
  RefreshTokentExistConstraint,
  RefreshTokenExistOptions,
} from '../refreshTokenExist.constraint';

export function RefreshTokenExist(
  options?: RefreshTokenExistOptions,
  validationOptions?: ValidationOptions,
) {
  return function (obj: Object, propName: string) {
    return registerDecorator({
      propertyName: propName,
      target: obj.constructor,
      constraints: [options],
      validator: RefreshTokentExistConstraint,
      options: validationOptions,
    });
  };
}
