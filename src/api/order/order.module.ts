import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SharedOrderModule } from './shared/sharedorder.module';

@Module({
  controllers: [OrderController],
  imports: [SharedOrderModule]
})
export class OrderModule {}
