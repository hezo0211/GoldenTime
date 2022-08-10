import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BrandNameMustNotExist } from '../../validators/decorators/brandNameMustNotExist.decorator';

export class CreateBrandDto {
  @ApiProperty()
  @BrandNameMustNotExist()
  @IsString()
  brandName: string;
}
