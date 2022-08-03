import { registerDecorator, ValidationOptions } from 'class-validator';
import { UserExistConstraint, UserExistOptions } from '../userExist.constraint';

export function UserExist(
  options?: UserExistOptions,
  validationOptions?: ValidationOptions,
) {
  return function (obj: Object, propName: string) {
    return registerDecorator({
      propertyName: propName,
      target: obj.constructor,
      validator: UserExistConstraint,
      constraints: [options],
      options: validationOptions,
    });
  };
}
