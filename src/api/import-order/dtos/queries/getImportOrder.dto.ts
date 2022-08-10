import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class GetImportOrderDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number = 32;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  offset?: number = 0;

  @ApiPropertyOptional({
    isArray: true,
    name: 'ids[]',
  })
  @IsUUID('all', { each: true })
  @IsOptional()
  ids?: string[] = [];

  @ApiPropertyOptional({
    isArray: true,
    name: 'creatorIds[]',
  })
  @IsUUID('all', { each: true })
  @IsOptional()
  creatorIds?: string[] = [];
}
