import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isDefined } from 'class-validator';
import { AES, enc } from 'crypto-js';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { Env } from 'src/shared/enums/Env.enum';
import { AccessAction } from '../enums/accessAction.enum';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const action = this.reflector.get<AccessAction>(
      'action',
      context.getHandler(),
    );
    if (!isDefined(action) || action == AccessAction.NONE) return true;
    const req = context.switchToHttp().getRequest<Request>();
    const accessCode = req.headers['access-code'];
    if (!isDefined(accessCode)) return false;
    const data = JSON.parse(
      AES.decrypt(accessCode, Env.MESSAGE_ENCRYPTION_KEY).toString(enc.Utf8),
    );
    try {
      if (dayjs(data.exp).isBefore(dayjs())) return false;
      Object.assign(req, { access: data });
    } catch {
      throw new BadRequestException('Invalid access code');
    }
    return true;
  }
}
