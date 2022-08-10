import { ValidationOptions } from 'class-validator';
import { WatchExist } from './watchExist.decorator';

export function WatchNameMustNotExist(options?: ValidationOptions) {
  return WatchExist({ watchName: false }, options);
}
