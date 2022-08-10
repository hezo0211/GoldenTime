import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watch } from '../entities/watch.entity';
import { WatchService } from '../watch.service';
import { WatchExistConstraint } from '../validators/watchExist.constraint';

@Module({
  imports: [TypeOrmModule.forFeature([Watch])],
  providers: [WatchService, WatchExistConstraint],
  exports: [WatchService, WatchExistConstraint],
})
export class SharedWatchModule {}
