import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CategoryNameMustNotExist } from '../../validators/decorators/categoryNameMustNotExist.decorator';

export class EditCategoryDto {
  @ApiPropertyOptional()
  @CategoryNameMustNotExist()
  @IsString()
  @IsOptional()
  categoryName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
