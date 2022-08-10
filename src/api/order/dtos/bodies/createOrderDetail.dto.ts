import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsUUID, Min } from 'class-validator';
import { WatchIdMustExist } from 'src/api/watch/validators/decorators/watchIdMustExist.decorator';

export class CreateOrderDetailDto {
  @ApiProperty()
  @WatchIdMustExist()
  @IsUUID()
  shoesId: string;

  @ApiProperty()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}
