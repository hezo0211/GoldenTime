import { ValidationOptions } from 'class-validator';
import { UserExist } from './userExist.decorator';

export function UserNameMustNotExist(options?: ValidationOptions) {
  return UserExist({ username: false }, options);
}
