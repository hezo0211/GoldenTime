import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { BrandIdMustExist } from '../../validators/decorators/brandIdMustExist.decorator';

export class BrandParamDto {
  @ApiProperty()
  @BrandIdMustExist()
  @IsUUID('all')
  id: string;
}
