import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import { AccessAction } from '../../enums/accessAction.enum';

export class OtpDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    enum: AccessAction,
  })
  @IsEnum(AccessAction)
  action: AccessAction;
}
