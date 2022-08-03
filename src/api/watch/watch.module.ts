import { Module } from '@nestjs/common';
import { WatchController } from './watch.controller';
import { SharedWatchModule } from './shared/sharedwatch.module';

@Module({
  controllers: [WatchController],
  imports: [SharedWatchModule]
})
export class WatchModule {}
