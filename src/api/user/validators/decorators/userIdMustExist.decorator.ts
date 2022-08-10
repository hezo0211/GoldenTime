import { ValidationOptions } from 'class-validator';
import { UserExist } from './userExist.decorator';

export function UserIdMustExist(options?: ValidationOptions) {
  return UserExist({ userId: true }, options);
}
