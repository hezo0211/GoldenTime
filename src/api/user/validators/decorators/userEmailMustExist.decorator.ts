import { ValidationOptions } from 'class-validator';
import { UserExist } from './userExist.decorator';

export function UserEmailMustExist(options?: ValidationOptions) {
  return UserExist(
    {
      email: true,
    },
    options,
  );
}
