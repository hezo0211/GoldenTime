import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  isDefined,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

export interface CategoryExistOptions {
  categoryId?: boolean;
  categoryName?: boolean;
}
@ValidatorConstraint({ async: true })
@Injectable()
export class CategoryExistContraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const options = <CategoryExistOptions>validationArguments.constraints[0];
    if (isDefined(options.categoryId)) {
      const data = await this.categoryRepository.count({
        where: { categoryId: value },
      });
      if (options.categoryId) return data > 0;
      return data == 0;
    }
    if (isDefined(options.categoryName)) {
      const data = await this.categoryRepository.count({
        where: { categoryName: value },
      });
      if (options.categoryName) return data > 0;
      return data == 0;
    }
    return true;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    const options = <CategoryExistOptions>validationArguments.constraints[0];
    if (options.categoryId === true) return 'Loại giày không tồn tại';
    if (options.categoryId === false) return 'Loại giày đã tồn tại';
    if (options.categoryName === true) return 'Tên loại giày không tồn tại';
    if (options.categoryName === false) return 'Tên loại giày đã tồn tại';
  }
}
