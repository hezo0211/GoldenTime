import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import {
  OrderSessionGuardHeaderKey,
  OrderSessionGuardMetaKey,
  OrderSessionGuard,
} from '../guards/orderSession.guard';

export function RequireOrderSession() {
  return applyDecorators(
    ApiHeader({ name: OrderSessionGuardHeaderKey }),
    SetMetadata(OrderSessionGuardMetaKey, true),
    UseGuards(OrderSessionGuard),
  );
}
