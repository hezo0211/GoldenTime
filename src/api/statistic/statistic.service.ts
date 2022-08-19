import { Injectable } from '@nestjs/common';
import Big from 'big.js';
import * as dayjs from 'dayjs';
import { CategoryService } from '../category/category.service';
import { OrderService } from '../order/order.service';
import { UserService } from '../user/user.service';
import { Duration } from './enums/Duration';

@Injectable()
export class StatisticService {
  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private categoryService: CategoryService,
  ) {}

  async PopularCategories(since: Date, to?: Date) {
    const result = this.categoryService
      .getRepository()
      .createQueryBuilder('category')
      .leftJoin(
        () =>
          this.orderService
            .getPreBuiltFindAllQuery(
              {
                datePurchased: { since, to },
                isPaid: true,
              },
              true,
            )
            .select('categories.categoryId', 'subCategoryId')
            .addSelect('order.orderId', 'orderId')
            .groupBy('order.orderId, categories.categoryId'),
        'total',
        'category.categoryId = "subCategoryId"',
      )
      .select('category.categoryName', 'categoryName')
      .addSelect('COUNT ("total"."orderId")', 'totalOrder')
      .groupBy('category.categoryId')
      .getRawMany();

    return result;
  }

  async RevenueProgress(from: Date, duration: Duration) {
    let since: dayjs.Dayjs, to: dayjs.Dayjs;
    switch (duration) {
      case Duration.YEARLY:
        since = dayjs(from).startOf('year');
        to = dayjs(from).endOf('year');
        break;
      case Duration.MONTHLY:
        since = dayjs(from).startOf('month');
        to = dayjs(from).endOf('month');
        break;
      case Duration.WEEKLY:
        since = dayjs(from).startOf('week');
        to = dayjs(from).endOf('week');
        break;
    }

    const result = await this.orderService
      .getPreBuiltFindAllQuery({
        datePurchased: { since: since.toDate(), to: to.toDate() },
        isPaid: true,
      })
      .getMany();

    const progress = { type: '', data: [] };

    //Yearly progress
    if (duration == Duration.YEARLY) {
      progress.type = Duration.YEARLY;
      for (let month = since.month(); month <= to.month(); month++) {
        progress.data.push(
          result
            .filter((order) => dayjs(order.datePurchased).month() == month)
            .reduce((pre, current) => {
              return new Big(current.totalPrice).plus(pre);
            }, new Big(0)),
        );
      }
    }
    //Monthly progress
    else if (duration == Duration.MONTHLY) {
      progress.type = Duration.MONTHLY;
      for (let date = since.date(); date <= to.date(); date++) {
        progress.data.push(
          result
            .filter((order) => dayjs(order.datePurchased).date() == date)
            .reduce((pre, current) => {
              return new Big(current.totalPrice).plus(pre);
            }, new Big(0)),
        );
      }
    }
    //Daily progress
    else if (duration == Duration.WEEKLY) {
      progress.type = Duration.WEEKLY;
      for (let day = since.day(); day <= to.day(); day++) {
        progress.data.push(
          result
            .filter((order) => dayjs(order.datePurchased).day() == day)
            .reduce((pre, current) => {
              return new Big(current.totalPrice).plus(pre);
            }, new Big(0)),
        );
      }
    }
    return progress;
  }

  async totalRegisterdUser(since: Date, to?: Date) {
    return await this.userService
      .getPreBuildFindAllQuery({
        createdAt: { since, to },
      })
      .getCount();
  }

  async Revenue(since: Date, to?: Date) {
    const result = await this.orderService
      .getPreBuiltFindAllQuery({
        datePurchased: { since, to },
        isPaid: true,
      })
      .getMany();
    return result.reduce(
      (pre, current) => new Big(current.totalPrice).plus(pre),
      new Big(0),
    );
  }

  async Income(since: Date, to?: Date) {
    const result = await this.orderService
      .getPreBuiltFindAllQuery({
        datePurchased: { since, to },
        isPaid: true,
      })
      .getMany();
    return result.reduce((pre, current) => {
      const totalImportPrice = current.details.reduce(
        (pre, detail) =>
          new Big(detail.watch.importPrice)
            .mul(new Big(detail.quantity))
            .plus(pre),
        new Big(0),
      );
      return new Big(current.totalPrice).plus(pre).minus(totalImportPrice);
    }, new Big(0));
  }

  async totalOrder(since: Date, to?: Date): Promise<number> {
    const queryBuilder = this.orderService
      .getRepository()
      .createQueryBuilder('order');
    const result = queryBuilder
      .andWhere('order.datePurchased  BETWEEN :since AND :to', {
        since: since,
        to: to ?? dayjs().toDate(),
      })
      .andWhere('order.datePurchased IS NOT NULL')
      .getCount();
    return result;
  }
}
