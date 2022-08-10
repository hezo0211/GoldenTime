import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class DeleteManyWatchDto {
  @ApiProperty()
  @IsUUID('all', { each: true })
  @IsArray()
  ids: string[];
}
