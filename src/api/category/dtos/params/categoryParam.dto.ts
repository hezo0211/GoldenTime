import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CategoryIdMustExist } from '../../validators/decorators/categoryIdMustExist.decorator';

export class CategoryParamDto {
  @ApiProperty()
  @CategoryIdMustExist()
  @IsUUID('all')
  id: string;
}
