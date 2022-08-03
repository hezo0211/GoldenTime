import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsUUID } from 'class-validator';
import { Role } from '../enums/role.enum';

@Exclude()
export class AuthRequest {
  @Expose()
  @IsUUID()
  userId: string;

  @Expose()
  @IsBoolean()
  isActive: boolean;

  @Expose()
  @IsEnum(Role)
  role: Role;
}

export const Auth = createParamDecorator((data, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest();
  return user;
});
