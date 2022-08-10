import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  isDefined,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';

export interface BrandExistOptions {
  brandId?: boolean;
  brandName?: boolean;
}
@ValidatorConstraint({ async: true })
@Injectable()
export class BrandExistContraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const options = <BrandExistOptions>validationArguments.constraints[0];
    if (isDefined(options.brandId)) {
      const result = await this.brandRepository.count({
        where: { brandId: value },
      });
      if (options.brandId) return result > 0;
      return result == 0;
    }
    if (isDefined(options.brandName)) {
      const result = await this.brandRepository.count({
        where: { brandName: value },
      });
      if (options.brandName) return result > 0;
      return result == 0;
    }
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    const options = <BrandExistOptions>validationArguments.constraints[0];
    if (options.brandId === true) return 'Thương hiệu không tồn tại';
    if (options.brandId === false) return 'Thương hiệu đã tồn tại';
    if (options.brandName === true) return 'Tên thương hiệu không tồn tại';
    if (options.brandName === false) return 'Tên thương hiệu đã tồn tại';
  }
}
