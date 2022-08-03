import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserEmailMustExist } from 'src/api/user/validators/decorators/userEmailMustExist.decorator';
import { UserNameMustExist } from 'src/api/user/validators/decorators/userNameMustExist.decorator';

export class LoginDto {
  @ApiProperty()
  @UserNameMustExist()
  @IsString()
  username: string;

  @ApiPropertyOptional()
  @UserEmailMustExist()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  password: string;
}
