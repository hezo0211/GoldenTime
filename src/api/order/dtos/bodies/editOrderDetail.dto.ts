import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsUUID, Min } from 'class-validator';
import { WatchIdMustExist } from 'src/api/watch/validators/decorators/watchIdMustExist.decorator';

export class EditOrderDetailDto {
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
