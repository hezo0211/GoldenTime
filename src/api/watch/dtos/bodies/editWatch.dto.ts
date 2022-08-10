import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { BrandIdMustExist } from 'src/api/brand/validators/decorators/brandIdMustExist.decorator';
import { CategoryIdMustExist } from 'src/api/category/validators/decorators/categoryIdMustExist.decorator';

export class EditWatchDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  watchName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    type: 'file',
    format: 'binary',
  })
  @IsOptional()
  watchImage?;

  @ApiPropertyOptional()
  @Length(1, 20)
  @IsString()
  @IsOptional()
  SKU?: string;

  @ApiPropertyOptional({
    type: [String],
    name: 'categories',
  })
  @CategoryIdMustExist({ each: true })
  @Transform((data) => {
    try {
      return JSON.parse(data.value);
    } catch {
      return data.value.split(',');
    }
  })
  @IsArray()
  @IsOptional()
  categories?: string[] = [];

  @ApiPropertyOptional()
  @BrandIdMustExist()
  @IsUUID()
  @IsOptional()
  brandId?: string;

  @ApiPropertyOptional()
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  importPrice?: number;

  @ApiPropertyOptional()
  @Max(100)
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sale?: number;

  @ApiPropertyOptional()
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity?: number;
}
