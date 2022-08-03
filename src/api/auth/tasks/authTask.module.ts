import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedUserModule } from 'src/api/user/shared/sharedUser.module';
import { ActivationCode } from '../entities/activationCode.entity';
import { RefreshToken } from '../entities/refreshToken.entity';
import { ActivationCodeTask } from './activationCodeTask';
import { RefreshTokenTask } from './refreshTokenTask';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken, ActivationCode]),
    SharedUserModule,
  ],
  providers: [RefreshTokenTask, ActivationCodeTask],
  exports: [RefreshTokenTask, ActivationCodeTask],
})
export class AuthTaskModule {}
