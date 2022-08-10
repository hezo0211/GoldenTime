import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Gender } from 'src/api/user/enums/gender';
import { PaymentMethod } from '../../enums/paymentMedthod.enum';

export class CreateOrderDto {
  @ApiProperty()
  @Length(1, 25)
  @IsString()
  postCode: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty()
  @Length(1, 35)
  @IsString()
  orderFirstName: string;

  @ApiProperty()
  @Length(1, 100)
  @IsString()
  orderLastName: string;

  @ApiProperty()
  orderPhoneNumber: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  orderEmail?: string;

  @ApiProperty()
  @IsEnum(Gender)
  orderGender: Gender;

  @ApiProperty()
  @Length(1, 35)
  @IsString()
  orderCity: string;

  @ApiProperty()
  @Length(1, 75)
  @IsString()
  orderDistrict: string;

  @ApiProperty()
  @IsString()
  orderAddress: string;

  @ApiProperty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
