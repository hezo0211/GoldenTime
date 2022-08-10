import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { WatchIdMustExist } from 'src/api/watch/validators/decorators/watchIdMustExist.decorator';

export class EditImportOrderDetailDto {
  @ApiProperty()
  @WatchIdMustExist()
  @IsUUID()
  shoesId: string;

  @ApiProperty()
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  quantity: number;
}
