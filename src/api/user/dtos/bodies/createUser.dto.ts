import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from 'src/api/auth/enums/role.enum';
import { Gender } from '../../enums/gender';
import { UserEmailMustNotExist } from '../../validators/decorators/userEmailMustNotExist.decorator';
import { UserNameMustNotExist } from '../../validators/decorators/userNameMustNotExist.decorator';

export class CreateUserDto {
  @ApiProperty()
  @UserNameMustNotExist()
  @IsString()
  username: string;
  @ApiProperty()
  @IsString()
  password: string;
  @ApiProperty()
  @UserEmailMustNotExist()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
  @ApiProperty({
    type: 'enum',
    enum: Role,
  })
  @IsEnum(Role)
  role: Role;
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsString()
  phoneNumber: string;
  @ApiProperty({
    type: 'enum',
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender;
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
