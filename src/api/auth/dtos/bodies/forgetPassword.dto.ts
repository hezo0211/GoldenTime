import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { UserEmailMustExist } from 'src/api/user/validators/decorators/userEmailMustExist.decorator';

export class ResetPasswordDto {
  @ApiProperty()
  @UserEmailMustExist()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
