import { Module } from '@nestjs/common';
import { SharedWatchModule } from '../watch/shared/sharedWatch.module';
import { OrderController } from './order.controller';
import { SharedOrderModule } from './shared/sharedOrder.module';

@Module({
  imports: [SharedWatchModule, SharedOrderModule],
  controllers: [OrderController],
})
export class OrderModule {}
