import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class DeleteManyCategoryDto {
  @ApiProperty()
  @IsUUID('all', { each: true })
  @IsArray()
  ids: string[];
}
