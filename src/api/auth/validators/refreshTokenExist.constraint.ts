import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  isBoolean,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refreshToken.entity';

export interface RefreshTokenExistOptions {
  token?: boolean;
}

@ValidatorConstraint({ async: true })
@Injectable()
export class RefreshTokentExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const options = <RefreshTokenExistOptions>(
      validationArguments.constraints[0]
    );
    if (isBoolean(options.token)) {
      const result = await this.refreshTokenRepository.count({
        where: { token: value },
      });
      if (options.token) return result > 0;
      return result == 0;
    }
    return true;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    const options = <RefreshTokenExistOptions>(
      validationArguments.constraints[0]
    );
    if (options.token) return 'Token không tồn tại';
    return 'Token đã tồn tại';
  }
}
