import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';
import { UserIdMustExist } from '../../validators/decorators/userIdMustExist.decorator';

export class DeleteManyUserDto {
  @ApiProperty()
  @UserIdMustExist({ each: true })
  @IsUUID('all', { each: true })
  @IsArray()
  ids: string[];
}
