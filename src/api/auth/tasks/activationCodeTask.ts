import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { LessThan, Repository } from 'typeorm';
import { ActivationCode } from '../entities/activationCode.entity';

@Injectable()
export class ActivationCodeTask {
  constructor(
    @InjectRepository(ActivationCode)
    private readonly activationCodeRepository: Repository<ActivationCode>,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async removeExpiredTokens() {
    await this.activationCodeRepository.delete({
      expiredAt: LessThan(dayjs().toDate()),
    });
  }
}
