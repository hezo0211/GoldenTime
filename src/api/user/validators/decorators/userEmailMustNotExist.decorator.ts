import { ValidationOptions } from 'class-validator';
import { UserExist } from './userExist.decorator';

export function UserEmailMustNotExist(options?: ValidationOptions) {
  return UserExist({ email: false }, options);
}
