import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { LessThan, Repository } from 'typeorm';
import { RefreshToken } from '../entities/refreshToken.entity';

@Injectable()
export class RefreshTokenTask {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  async removeExpiredTokens() {
    await this.refreshTokenRepository.delete({
      expiredAt: LessThan(dayjs().toDate()),
    });
  }
}
