import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  isDefined,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { Watch } from '../entities/watch.entity';

export interface WatchExistOptions {
  watchId?: boolean;
  watchName?: boolean;
}

@ValidatorConstraint({ async: true })
@Injectable()
export class WatchExistConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Watch)
    private readonly watchRepository: Repository<Watch>,
  ) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const options = <WatchExistOptions>validationArguments.constraints[0];
    if (isDefined(options.watchId)) {
      const data = await this.watchRepository.count({
        where: { watchId: value },
      });
      if (options.watchId) return data > 0;
      return data == 0;
    }
    if (isDefined(options.watchName)) {
      const data = await this.watchRepository.count({
        where: { watchName: value },
      });
      if (options.watchName) return data > 0;
      return data == 0;
    }
    return true;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    const options = <WatchExistOptions>validationArguments.constraints[0];
    if (options.watchId === true) return 'Đồng hồ không tồn tại';
    if (options.watchId === false) return 'Đồng hồ đã tồn tại';
    if (options.watchName === true) return 'Tên đồng hồ không tồn tại';
    if (options.watchName === false) return 'Tên đồng hồ đã tồn tại';
  }
}
