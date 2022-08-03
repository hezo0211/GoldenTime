import { UseGuards } from '@nestjs/common';
import { ActiveGuard } from '../guards/active.guard';

export function MustActive() {
  return UseGuards(ActiveGuard);
}
