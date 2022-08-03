import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { RefreshTokenMustExist } from '../../validators/decorators/refreshTokenIdMustExist.decorator';

export class RefreshDto {
  @ApiProperty()
  @RefreshTokenMustExist()
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
