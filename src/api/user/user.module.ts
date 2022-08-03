import { Module } from '@nestjs/common';
import { SharedUserModule } from './shared/sharedUser.module';
import { UserController } from './user.controller';

@Module({
  imports: [SharedUserModule],
  controllers: [UserController],
})
export class UserModule {}
