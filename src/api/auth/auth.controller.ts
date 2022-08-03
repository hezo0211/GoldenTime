import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { AES, enc } from 'crypto-js';
import { Env } from 'src/shared/enums/Env.enum';
import { AuthService } from './auth.service';
import { RefreshDto as RefreshDto } from './dtos/bodies/refresh.dto';
import { JsonEntity } from 'src/shared/JsonEntity';
import { SignUpDto } from './dtos/bodies/signUp.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/bodies/login.dto';
import * as bcrypt from 'bcrypt';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequest } from './decorators/auth.decorator';
import { JsonAction } from 'src/shared/JsonAction';
import { RequireAction } from './decorators/requireAction';
import { AccessAction } from './enums/accessAction.enum';
import { Access, AccessRequest } from './decorators/access.decorator';
import { OtpDto } from './dtos/bodies/otp.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { AccessCodeDto } from './dtos/queries/accessCode.dto';
import { isDefined } from 'class-validator';
import * as dayjs from 'dayjs';
import { ResetPasswordDto } from './dtos/bodies/forgetPassword.dto';

@ApiTags('Bảo mật hệ thống')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  @Get('accessCode')
  async getAccessCode(@Query() accessCodeDto: AccessCodeDto) {
    const activationCode = await this.authService.getActivationCodeFromEmail(
      accessCodeDto.email,
      accessCodeDto.code,
    );
    if (!isDefined(activationCode))
      throw new BadRequestException('Invalid access code');

    const newAccessCode = new AccessRequest();
    newAccessCode.action = activationCode.action;
    newAccessCode.email = activationCode.email;
    newAccessCode.exp = dayjs().add(30, 'minutes').toDate();

    return new JsonEntity({
      accessCode: AES.encrypt(
        JSON.stringify(instanceToPlain(newAccessCode)),
        Env.MESSAGE_ENCRYPTION_KEY,
      ).toString(),
    });
  }

  @Post('otp')
  async sendOtp(@Body() otpDto: OtpDto) {
    const code = await this.authService.createActivationCode({
      action: otpDto.action,
      email: otpDto.email,
    });

    await this.mailerService.sendMail({
      to: otpDto.email,
      subject: 'Xác nhận hành động',
      template: 'confirmEmail',
      context: {
        code: code,
      },
    });
    return new JsonAction();
  }

  @Post('signUp')
  @RequireAction(AccessAction.CREATE_ACCOUNT)
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Access() accessRequest: AccessRequest,
  ) {
    if (signUpDto.email != accessRequest.email)
      throw new BadRequestException('Invalid access');
    const user = plainToInstance(User, signUpDto);
    user.isActive = true;
    await this.userService.update(user);
    return new JsonEntity(instanceToPlain(user));
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const repository = this.userService.getRepository();
    const user = await repository.findOne({
      where: [{ username: loginDto.username }, { email: loginDto.email }],
    });
    if (!(await bcrypt.compare(loginDto.password, user.password)))
      throw new BadRequestException('Mật khẩu không hợp lệ');
    const auth = plainToInstance(AuthRequest, user);
    return new JsonEntity(
      await this.authService.createToken(instanceToPlain(auth)),
    );
  }

  @Post('resetPassword')
  @RequireAction(AccessAction.RESET_PASSWORD)
  async forgetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Access() accessRequest: AccessRequest,
  ) {
    if (resetPasswordDto.email != accessRequest.email)
      throw new BadRequestException('Invalid access');
    const user = await this.userService.getRepository().findOne({
      where: {
        email: accessRequest.email,
      },
    });
    user.password = resetPasswordDto.password;
    await this.userService.update(user);
    return new JsonEntity(instanceToPlain(user));
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    const token = AES.decrypt(
      refreshDto.refreshToken,
      Env.MESSAGE_ENCRYPTION_KEY,
    ).toString(enc.Utf8);
    const auth = plainToInstance(AuthRequest, JSON.parse(token), {
      excludeExtraneousValues: true,
    });
    await this.authService.removeRefreshToken(refreshDto.refreshToken);
    return new JsonEntity(
      await this.authService.createToken(instanceToPlain(auth)),
    );
  }
}
