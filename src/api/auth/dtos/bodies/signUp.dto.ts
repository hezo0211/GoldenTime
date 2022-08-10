import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
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
  @Length(1, 35)
  @IsString()
  firstName: string;

  @ApiProperty()
  @Length(1, 100)
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: string;

  @ApiProperty()
  @Length(1, 35)
  @IsString()
  city: string;

  @ApiProperty()
  @Length(1, 75)
  @IsString()
  district: string;

  @ApiProperty()
  @Length(1, 255)
  @IsString()
  address: string;
}
