import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Type } from 'class-transformer';
import { Allow } from 'class-validator';

export class OrderSessionRequest {
  @Allow()
  @Type(() => String)
  orderId: string;

  @Allow()
  @Type(() => Date)
  expiredAt: Date;
}

export const OrderSession = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const { orderSession } = ctx.switchToHttp().getRequest();
    return orderSession;
  },
);
