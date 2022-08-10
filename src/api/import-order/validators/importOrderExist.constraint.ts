import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  isDefined,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { ImportOrder } from '../entities/importOrder.entity';

export interface ImportOrderExistOptions {
  importOrderId?: boolean;
}

@ValidatorConstraint({ async: true })
@Injectable()
export class ImportOrderExistContraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(ImportOrder)
    private readonly importOrderRepository: Repository<ImportOrder>,
  ) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const options = <ImportOrderExistOptions>validationArguments.constraints[0];
    if (isDefined(options.importOrderId)) {
      const result = await this.importOrderRepository.count({
        where: { importOrderId: value },
      });
      if (options.importOrderId) return result > 0;
      return result == 0;
    }
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    const options = <ImportOrderExistOptions>validationArguments.constraints[0];
    if (options.importOrderId === true) return 'Đơn nhập không tồn tại';
    if (options.importOrderId === false) return 'Đơn nhập đã tồn tại';
  }
}
