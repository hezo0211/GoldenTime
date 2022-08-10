import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { AccessAction } from '../enums/activationAction.enum';
import { AccessGuard } from '../guards/access.guard';

export function RequireAction(action: AccessAction) {
  return applyDecorators(
    SetMetadata('action', action),
    UseGuards(AccessGuard),
    ApiHeader({ name: 'access-code' }),
  );
}
