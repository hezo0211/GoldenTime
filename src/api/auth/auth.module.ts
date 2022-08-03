import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strageties/JwtStrategy';
import { SharedUserModule } from '../user/shared/sharedUser.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refreshToken.entity';
import { ActivationCode } from './entities/activationCode.entity';
import { Env } from 'src/shared/enums/Env.enum';
import { RefreshTokentExistConstraint } from './validators/refreshTokenExist.constraint';
import { AuthTaskModule } from './tasks/authTask.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get(Env.JWT_SECRET),
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([RefreshToken, ActivationCode]),
    SharedUserModule,
    AuthTaskModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokentExistConstraint],
})
export class AuthModule {}
