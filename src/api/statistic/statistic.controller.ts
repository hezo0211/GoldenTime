import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { JsonEntity } from 'src/shared/JsonEntity';
import { Authenticate } from '../auth/decorators/authenticate.decorator';
import { Role } from '../auth/enums/role.enum';
import { GetGeneralDto } from './dtos/queries/getGeneral.dto';
import { Duration } from './enums/Duration';
import { StatisticService } from './statistic.service';

@ApiTags('Báo cáo thống kê')
@Controller('statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}
  @Get('general')
  @Authenticate(Role.Admin, Role.Employee)
  async getGeneral(@Query() getGeneralDto: GetGeneralDto) {
    const { from, duration } = getGeneralDto;
    let since: dayjs.Dayjs;
    let to: dayjs.Dayjs;

    switch (duration) {
      case Duration.YEARLY:
        since = dayjs(from).startOf('year');
        to = dayjs(from).endOf('year');
      case Duration.MONTHLY:
        since = dayjs(from).startOf('month');
        to = dayjs(from).endOf('month');
        break;
      case Duration.WEEKLY:
        since = dayjs(from).startOf('week');
        to = dayjs(from).endOf('week');
    }
    return new JsonEntity({
      renevue: await this.statisticService.Revenue(since.toDate(), to.toDate()),
      income: await this.statisticService.Income(since.toDate(), to.toDate()),
      totalOrder: await this.statisticService.totalOrder(
        since.toDate(),
        to.toDate(),
      ),
      totalRegisterdUser: await this.statisticService.totalRegisterdUser(
        since.toDate(),
        to.toDate(),
      ),
      revenueProgress: await this.statisticService.RevenueProgress(
        from,
        duration,
      ),
      categories: await this.statisticService.PopularCategories(
        since.toDate(),
        to.toDate(),
      ),
    });
  }
}
