import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivationCode } from './entities/activationCode.entity';
import { RefreshToken } from './entities/refreshToken.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/shared/enums/Env.enum';
import { AccessAction } from './enums/accessAction.enum';
import * as dayjs from 'dayjs';
import { AES } from 'crypto-js';

export interface CreateTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CreateActivationCodeOptions {
  email: string;
  action: AccessAction;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(ActivationCode)
    private readonly activationCodeRepository: Repository<ActivationCode>,

    private readonly configService: ConfigService,
  ) {}

  async createToken(payload: any): Promise<CreateTokenResponse> {
    const refreshToken = new RefreshToken();
    refreshToken.token = AES.encrypt(
      JSON.stringify(payload),
      Env.MESSAGE_ENCRYPTION_KEY,
    ).toString();
    refreshToken.expiredAt = dayjs().add(30, 'days').toDate();
    await this.refreshTokenRepository.save(refreshToken);
    return {
      accessToken: jwt.sign(payload, this.configService.get(Env.JWT_SECRET), {
        expiresIn: '15 minutes',
      }),
      refreshToken: refreshToken.token,
    };
  }
  async removeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token: token });
  }

  async getActivationCodeFromEmail(
    email: string,
    code: string,
  ): Promise<ActivationCode> {
    return await this.activationCodeRepository.findOne({
      where: {
        email: email,
        code: code,
      },
    });
  }

  async createActivationCode(
    options: CreateActivationCodeOptions,
  ): Promise<string> {
    //Đảm bảo rằng mã xác nhận cũ sẽ bị xoá
    await this.activationCodeRepository.delete({
      action: options.action,
      email: options.email,
    });

    const activationCode = new ActivationCode();
    activationCode.email = options.email;
    activationCode.action = options.action;
    activationCode.expiredAt = dayjs().add(5, 'minutes').toDate();
    await this.activationCodeRepository.save(activationCode);
    return activationCode.code;
  }
}
