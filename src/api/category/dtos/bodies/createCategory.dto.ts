import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CategoryNameMustNotExist } from '../../validators/decorators/categoryNameMustNotExist.decorator';

export class CreateCategoryDto {
  @ApiProperty()
  @CategoryNameMustNotExist()
  @IsString()
  categoryName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
