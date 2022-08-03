import { ValidationOptions } from 'class-validator';
import { RefreshTokenExist } from './refreshTokenExist.decorator';

export function RefreshTokenMustExist(options?: ValidationOptions) {
  return RefreshTokenExist({ token: true }, options);
}
