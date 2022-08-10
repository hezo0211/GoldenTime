import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class DeleteManyImportOrderDto {
  @ApiProperty()
  @IsUUID('all', { each: true })
  @IsArray()
  ids: string[];
}
