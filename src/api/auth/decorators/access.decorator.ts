import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsEmail, IsEnum } from 'class-validator';
import { AccessAction } from '../enums/activationAction.enum';

@Exclude()
export class AccessRequest {
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsEnum(AccessAction)
  action: AccessAction;

  @Expose()
  @Type(() => Date)
  exp: Date;
}

export const Access = createParamDecorator((data, ctx: ExecutionContext) => {
  const { access } = ctx.switchToHttp().getRequest();
  return access;
});
