import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BrandNameMustNotExist } from '../../validators/decorators/brandNameMustNotExist.decorator';

export class EditBrandDto {
  @ApiPropertyOptional()
  @BrandNameMustNotExist()
  @IsString()
  @IsOptional()
  brandName?: string;
}
