import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Authenticate(...roles: Role[]) {
  return applyDecorators(
    ApiBearerAuth(),
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
