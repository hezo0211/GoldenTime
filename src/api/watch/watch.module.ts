import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { SharedWatchModule } from './shared/sharedWatch.module';
import { WatchController } from './watch.controller';

@Module({
  imports: [
    SharedWatchModule,
    MulterModule.register({
      dest: './uploads',
      fileFilter: (req, file, callback) => {
        if (file.mimetype.match(/^image\/.*/i)) callback(null, true);
        else callback(new BadRequestException('File không hợp lệ'), false);
      },
    }),
  ],
  controllers: [WatchController],
})
export class WatchModule {}
