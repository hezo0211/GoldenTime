import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { ImportOrderIdMustExist as OrderIdMustExist } from '../../validators/decorators/orderIdMustExist.decorator';

export class OrderParamDto {
  @ApiProperty()
  @OrderIdMustExist()
  @IsUUID()
  id: string;
}
