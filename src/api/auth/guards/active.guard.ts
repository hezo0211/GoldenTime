import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { isDefined } from 'class-validator';
import { Observable } from 'rxjs';

@Injectable()
export class ActiveGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (!isDefined(user)) return false;
    else return user.isActive;
  }
}
