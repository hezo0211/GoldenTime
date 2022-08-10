import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetCategoryDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  @Max(100)
  @IsPositive()
  @IsNumber()
  @IsOptional()
  limit?: number = 32;

  @ApiPropertyOptional()
  @Type(() => Number)
  @Min(0)
  @IsNumber()
  @IsOptional()
  offset?: number = 0;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  categoryName?: string;
}
