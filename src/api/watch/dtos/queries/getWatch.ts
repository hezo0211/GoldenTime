import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class PriceFilter {
  @ApiProperty({
    name: 'price[from]',
  })
  @IsNumber()
  @Type(() => Number)
  from: number;

  @ApiPropertyOptional({
    name: 'price[to]',
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  to?: number;
}

export class GetWatchDto {
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

  @ApiPropertyOptional({
    isArray: true,
    name: 'ids[]',
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  ids?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  watchName?: string;

  @ApiPropertyOptional({
    isArray: true,
    name: 'categoryIds[]',
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  categoryIds?: string[];

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  size?: number;

  @ApiPropertyOptional({
    name: 'price',
  })
  @ValidateNested()
  @Type(() => PriceFilter)
  @IsOptional()
  price?: PriceFilter;
}
