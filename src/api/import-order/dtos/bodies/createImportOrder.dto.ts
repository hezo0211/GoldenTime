import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateImportOrderDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note?: string;
}
