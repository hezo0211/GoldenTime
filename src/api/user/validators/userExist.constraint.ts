import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  isBoolean,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export interface UserExistOptions {
  userId?: boolean;
  username?: boolean;
  email?: boolean;
}

@ValidatorConstraint({ async: true })
@Injectable()
export class UserExistConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const options = <UserExistOptions>validationArguments.constraints[0];
    if (isBoolean(options.userId)) {
      const result = await this.userRepository.count({
        where: { userId: value },
      });
      if (options.userId) return result > 0;
      return result == 0;
    }
    if (isBoolean(options.username)) {
      const result = await this.userRepository.count({
        where: { username: value },
      });
      if (options.username) return result > 0;
      return result == 0;
    }
    if (isBoolean(options.email)) {
      const result = await this.userRepository.count({
        where: { email: value },
      });
      if (options.email) return result > 0;
      return result == 0;
    }
    return true;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    const options = <UserExistOptions>validationArguments.constraints[0];
    if (options.userId === true) return 'Id người dùng không tồn tại';
    if (options.userId === false) return 'Id người dùng đã tồn tại';

    if (options.username === true) return 'Tên đăng nhập không tồn tại';
    if (options.username === false) return 'Tên đăng nhập đã tồn tại';

    if (options.email === true) return 'Email không tồn tại';
    if (options.email === false) return 'Email đã tồn tại';
  }
}
