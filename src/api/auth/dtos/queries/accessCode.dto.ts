import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class AccessCodeDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(6)
  @IsString()
  code: string;
}
