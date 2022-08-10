import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class GetUserDto {
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
  ids?: string[] = [];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fullName?: string;
}
