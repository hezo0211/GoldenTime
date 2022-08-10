import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { WatchIdMustExist } from '../../validators/decorators/watchIdMustExist.decorator';

export class WatchParamDto {
  @ApiProperty()
  @WatchIdMustExist()
  @IsUUID()
  id: string;
}
