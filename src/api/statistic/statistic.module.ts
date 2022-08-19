import { Module } from '@nestjs/common';
import { SharedCategoryModule } from '../category/shared/sharedCategory.module';
import { SharedOrderModule } from '../order/shared/sharedOrder.module';
import { SharedUserModule } from '../user/shared/sharedUser.module';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';

@Module({
  imports: [SharedOrderModule, SharedUserModule, SharedCategoryModule],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
