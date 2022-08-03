import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { Gender } from 'src/api/user/enums/gender';
import { UserEmailMustNotExist } from 'src/api/user/validators/decorators/userEmailMustNotExist.decorator';
import { UserNameMustNotExist } from 'src/api/user/validators/decorators/userNameMustNotExist.decorator';

export class SignUpDto {
  @ApiProperty()
  @UserNameMustNotExist()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @UserEmailMustNotExist()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({type:"enum",enum:Gender})
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  address: string;
}
