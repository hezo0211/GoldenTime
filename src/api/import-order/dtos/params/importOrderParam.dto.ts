import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { ImportOrderIdMustExist } from '../../validators/decorators/importOrderIdMustExist.decorator';

export class ImportOrderParamDto {
  @ApiProperty()
  @ImportOrderIdMustExist()
  @IsUUID()
  id: string;
}
