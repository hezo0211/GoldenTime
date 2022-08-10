import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { WatchIdMustExist } from 'src/api/watch/validators/decorators/watchIdMustExist.decorator';

export class DeleteImportOrderDetailDto {
  @ApiProperty()
  @WatchIdMustExist()
  @IsUUID()
  shoesId: string;
}
