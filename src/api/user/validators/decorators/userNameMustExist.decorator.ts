import { ValidationOptions } from 'class-validator';
import { UserExist } from './userExist.decorator';

export function UserNameMustExist(options?: ValidationOptions) {
  return UserExist({ username: true }, options);
}
