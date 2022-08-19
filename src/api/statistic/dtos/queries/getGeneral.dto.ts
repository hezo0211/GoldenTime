import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Allow, IsEnum } from 'class-validator';
import { Duration } from '../../enums/Duration';

export class GetGeneralDto {
  @ApiProperty()
  @Type(() => Date)
  @Allow()
  from: Date;

  @ApiProperty()
  @IsEnum(Duration)
  duration: Duration;
}
