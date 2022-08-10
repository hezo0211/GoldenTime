import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditImportOrderDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note?: string;
}
