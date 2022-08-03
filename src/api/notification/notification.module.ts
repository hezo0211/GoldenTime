import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { SharedNotificationModule } from './shared/sharednotification.module';

@Module({
  controllers: [NotificationController],
  imports: [SharedNotificationModule]
})
export class NotificationModule {}

