import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  isArray,
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

export class CreateWatchDto {
  @ApiProperty()
  @IsString()
  watchName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'file',
    format: 'binary',
  })
  watchImage;

  @ApiProperty()
  @Length(1, 20)
  @IsString()
  SKU: string;

  @ApiPropertyOptional({
    isArray: true,
    type: String,
    name: 'categories[]',
  })
  @CategoryIdMustExist({ each: true })
  @IsUUID('all', { each: true })
  @Transform((data) => {
    if (!isArray(data.value)) return [];
    const result = data.value[0] as string;
    return result.split(',');
  })
  @IsArray()
  @IsOptional()
  categories?: string[];

  @ApiPropertyOptional()
  @BrandIdMustExist()
  @IsUUID()
  @IsOptional()
  brandId?: string;

  @ApiProperty()
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty()
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  importPrice: number;

  @ApiProperty()
  @Max(100)
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  sale: number;

  @ApiProperty()
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  quantity: number;
}
