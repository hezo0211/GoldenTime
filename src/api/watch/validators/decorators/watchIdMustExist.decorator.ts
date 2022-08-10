import { ValidationOptions } from 'class-validator';
import { WatchExist } from './watchExist.decorator';

export function WatchIdMustExist(options?: ValidationOptions) {
  return WatchExist({ watchId: true }, options);
}
