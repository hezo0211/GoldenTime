import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { UserEmailMustNotExist } from '../../validators/decorators/userEmailMustNotExist.decorator';
import { UserNameMustNotExist } from '../../validators/decorators/userNameMustNotExist.decorator';

export class UserExistDto {
  @ApiPropertyOptional()
  @UserEmailMustNotExist()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @UserNameMustNotExist()
  @IsOptional()
  username?: string;
}
