import { Module } from '@nestjs/common';
import { SharedWatchModule } from '../watch/shared/sharedWatch.module';
import { ImportOrderController } from './importOrder.controller';
import { SharedImportOrderModule } from './shared/sharedImportOrder.module';

@Module({
  imports: [SharedWatchModule, SharedImportOrderModule],
  controllers: [ImportOrderController],
})
export class ImportOrderModule {}
