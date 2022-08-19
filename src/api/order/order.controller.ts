import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { isDefined } from 'class-validator';
import { JsonAction } from 'src/shared/JsonAction';
import { JsonCollection } from 'src/shared/JsonCollection';
import { JsonEntity } from 'src/shared/JsonEntity';
import { Auth, AuthRequest } from '../auth/decorators/auth.decorator';
import { Authenticate } from '../auth/decorators/authenticate.decorator';
import { Role } from '../auth/enums/role.enum';
import { WatchService } from '../watch/watch.service';
import { User } from '../user/entities/user.entity';
import { CreateOrderDto } from './dtos/bodies/createOrder.dto';
import { CreateOrderDetailDto } from './dtos/bodies/createOrderDetail.dto';
import { DeleteOrderDetailDto } from './dtos/bodies/deleteOrderDetail.dto';
import { EditOrderDto } from './dtos/bodies/editOrder.decorator';
import { EditOrderDetailDto } from './dtos/bodies/editOrderDetail.dto';
import { OrderParamDto } from './dtos/params/orderParam.dto';
import { GetOrderDto } from './dtos/queries/getOrder.dto';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/orderDetail.entity';
import { OrderStatus } from './enums/orderStatus.enum';
import { OrderService } from './order.service';
import { OrderDetailService } from './orderDetail.service';
import {
  OrderSession,
  OrderSessionRequest,
} from './decoratos/orderSession.decorator';

@ApiTags('Hoá đơn xuất')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderDetailService: OrderDetailService,
    private readonly shoesService: WatchService,
  ) {}

  @Get('me')
  @Authenticate(Role.Admin, Role.Employee, Role.User)
  async getMyOrder(
    @Auth() auth: AuthRequest,
    @Query() getOrderDto: GetOrderDto,
  ) {
    const { limit, offset, ids, sortBy } = getOrderDto;
    const queryBD = this.orderService
      .getPreBuiltFindAllQuery({ limit, offset, ids, sortBy })
      .andWhere('owner.userId = :userId', { userId: auth.userId });

    const data = await queryBD.getManyAndCount();
    return new JsonCollection(data[0])
      .setLimit(getOrderDto.limit)
      .setOffset(getOrderDto.offset)
      .setTotal(data[1]);
  }
  @Post('me')
  @Authenticate(Role.Admin, Role.Employee, Role.User)
  async createMyOrder(
    @Auth() auth: AuthRequest,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const order = plainToInstance(Order, createOrderDto);
    order.owner = plainToInstance(User, { userId: auth.userId });
    order.status = OrderStatus.WAIT_FOR_CONFIRMATION;
    return new JsonEntity(await this.orderService.update(order));
  }
  @Put('me/:id')
  @Authenticate(Role.Admin, Role.Employee, Role.User)
  async editMyOrder(
    @Auth() auth: AuthRequest,
    @Body() editOrderDto: EditOrderDto,
    @Param() orderParamDto: OrderParamDto,
  ) {
    const orderRepo = this.orderService.getRepository();
    let order = await orderRepo.findOne({
      where: { owner: { userId: auth.userId }, orderId: orderParamDto.id },
    });

    if (!isDefined(order))
      throw new BadRequestException('Không tìm thấy đơn hàng');
    if (order.status != OrderStatus.WAIT_FOR_CONFIRMATION)
      throw new BadRequestException('Đơn hàng đã được xác nhận');

    order = plainToInstance(Order, { ...order, ...editOrderDto });
    await this.orderService.update(order);
    return new JsonEntity(order);
  }
  @Delete('me/:id')
  @Authenticate(Role.Admin, Role.Employee, Role.User)
  async deleteMyOrder(
    @Auth() auth: AuthRequest,
    @Param() orderParamDto: OrderParamDto,
  ) {
    const orderRepo = this.orderService.getRepository();
    const order = await orderRepo.findOne({
      where: { owner: { userId: auth.userId }, orderId: orderParamDto.id },
    });
    if (!isDefined(order))
      throw new BadRequestException('Không tìm thấy đơn hàng');
    if (order.status != OrderStatus.WAIT_FOR_CONFIRMATION)
      throw new BadRequestException('Đơn hàng đã được xác nhận');

    await this.orderService.deleteById(order.orderId);
    return new JsonAction();
  }
  @Post('me/:id/detail')
  @Authenticate(Role.Admin, Role.Employee, Role.User)
  async createMyOrderDetail(
    @Auth() auth: AuthRequest,
    @Param() orderParamDto: OrderParamDto,
    @Body() createOrderDetailDto: CreateOrderDetailDto,
  ) {
    const orderRepo = this.orderService.getRepository();
    const order = await orderRepo.findOne({
      where: { owner: { userId: auth.userId }, orderId: orderParamDto.id },
    });
    if (!isDefined(order))
      throw new BadRequestException('Không tìm thấy đơn hàng');
    if (order.status != OrderStatus.WAIT_FOR_CONFIRMATION)
      throw new BadRequestException('Đơn hàng đã được xác nhận');

    const shoes = await this.shoesService.findById(
      createOrderDetailDto.watchId,
    );
    let orderDetail = await this.orderDetailService.findById(
      order.orderId,
      shoes.watchId,
    );
    if (isDefined(orderDetail))
      throw new BadRequestException('Chi tiết đơn hàng đã tồn tại');

    if (shoes.quantity < createOrderDetailDto.quantity)
      throw new BadRequestException('Số lượng quá mức yêu cầu');

    orderDetail = new OrderDetail();
    orderDetail.order = order;
    orderDetail.watch = shoes;
    orderDetail.sale = shoes.sale;
    orderDetail.price = shoes.price;
    orderDetail.quantity = createOrderDetailDto.quantity;
    await this.orderDetailService.update(orderDetail);
    return new JsonEntity(orderDetail);
  }
  @Put('me/:id/detail')
  @Authenticate(Role.Admin, Role.Employee, Role.User)
  async editMyOrderDetail(
    @Auth() auth: AuthRequest,
    @Param() orderParamDto: OrderParamDto,
    @Body() editOrderDetailDto: EditOrderDetailDto,
  ) {
    const orderRepo = this.orderService.getRepository();
    const order = await orderRepo.findOne({
      where: { owner: { userId: auth.userId }, orderId: orderParamDto.id },
      relations: { details: { watch: true } },
    });
    if (!isDefined(order))
      throw new BadRequestException('Không tìm thấy đơn hàng');
    if (order.status != OrderStatus.WAIT_FOR_CONFIRMATION)
      throw new BadRequestException('Đơn hàng đã được xác nhận');

    const orderDetail = order.details.find(
      (detail) => detail.watchId == editOrderDetailDto.shoesId,
    );
    if (!isDefined(orderDetail))
      throw new BadRequestException('Chi tiết đơn hàng không tồn tại');

    if (orderDetail.watch.quantity < editOrderDetailDto.quantity)
      throw new BadRequestException('Số lượng quá mức yêu cầu');

    orderDetail.quantity = editOrderDetailDto.quantity;
    await this.orderDetailService.update(orderDetail);
    return new JsonEntity(orderDetail);
  }
  @Delete('me/:id/detail')
  @Authenticate(Role.Admin, Role.Employee, Role.User)
  async deleteMyOrderDetail(
    @Auth() auth: AuthRequest,
    @Param() orderParamDto: OrderParamDto,
    @Body() deleteOrderDetail: DeleteOrderDetailDto,
  ) {
    const orderRepo = this.orderService.getRepository();
    const order = await orderRepo.findOne({
      where: { owner: { userId: auth.userId }, orderId: orderParamDto.id },
    });
    if (!isDefined(order))
      throw new BadRequestException('Không tìm thấy đơn hàng');
    if (order.status != OrderStatus.WAIT_FOR_CONFIRMATION)
      throw new BadRequestException('Đơn hàng đã được xác nhận');

    const orderDetail = await this.orderDetailService.findById(
      order.orderId,
      deleteOrderDetail.shoesId,
    );
    if (!isDefined(orderDetail))
      throw new BadRequestException('Chi tiết đơn hàng không tồn tại');

    await this.orderDetailService.deleteById(
      orderDetail.orderId,
      deleteOrderDetail.shoesId,
    );
    return new JsonAction();
  }

  //Dành cho khách ẩn danh
  @Post('anonymous')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = plainToInstance(Order, createOrderDto);
    order.status = OrderStatus.WAIT_FOR_CONFIRMATION;
    const result = new JsonEntity(await this.orderService.update(order));
    return {
      ...result,
      orderSessionToken: await this.orderService.createOrderSessionToken(
        order.orderId,
      ),
    };
  }

  @Post('anonymous/detail')
  async createDetailOrder(
    @OrderSession() orderSession: OrderSessionRequest,
    @Body() createOrderDetailDto: CreateOrderDetailDto,
  ) {
    const order = await this.orderService.findById(orderSession.orderId);
    if (!isDefined(order))
      throw new BadRequestException('Không tìm thấy đơn hàng');
    if (order.status != OrderStatus.WAIT_FOR_CONFIRMATION)
      throw new BadRequestException('Đơn hàng đã được xác nhận');

    const watch = await this.shoesService.findById(
      createOrderDetailDto.watchId,
    );
    let orderDetail = await this.orderDetailService.findById(
      order.orderId,
      watch.watchId,
    );

    if (isDefined(orderDetail))
      throw new BadRequestException('Chi tiết đơn hàng đã tồn tại');

    if (watch.quantity < createOrderDetailDto.quantity)
      throw new BadRequestException('Số lượng quá mức yêu cầu');

    orderDetail = new OrderDetail();
    orderDetail.order = order;
    orderDetail.watch = watch;
    orderDetail.sale = watch.sale;
    orderDetail.price = watch.price;
    orderDetail.quantity = createOrderDetailDto.quantity;
    await this.orderDetailService.update(orderDetail);
    return new JsonEntity(orderDetail);
  }

  //Admin
  @Put(':id')
  @Authenticate(Role.Admin, Role.Employee, Role.User)
  async editOrder(
    @Body() editOrderDto: EditOrderDto,
    @Param() orderParamDto: OrderParamDto,
  ) {
    let order = await this.orderService.findById(orderParamDto.id);
    if (!isDefined(order))
      throw new BadRequestException('Không tìm thấy đơn hàng');

    order = plainToInstance(Order, { ...order, ...editOrderDto });

    //Avoid insert to database
    delete order.details;
    await this.orderService.update(order);
    return new JsonEntity(order);
  }
  @Post(':id/detail')
  @Authenticate(Role.Admin, Role.Employee, Role.User)
  async createOrderDetail(
    @Param() orderParamDto: OrderParamDto,
    @Body() createOrderDetailDto: CreateOrderDetailDto,
  ) {
    const order = await this.orderService.findById(orderParamDto.id);
    if (!isDefined(order))
      throw new BadRequestException('Không tìm thấy đơn hàng');
    if (order.status != OrderStatus.WAIT_FOR_CONFIRMATION)
      throw new BadRequestException('Đơn hàng đã được xác nhận');

    const watch = await this.shoesService.findById(
      createOrderDetailDto.watchId,
    );
    let orderDetail = await this.orderDetailService.findById(
      order.orderId,
      watch.watchId,
    );
    if (isDefined(orderDetail))
      throw new BadRequestException('Chi tiết đơn hàng đã tồn tại');

    if (watch.quantity < createOrderDetailDto.quantity)
      throw new BadRequestException('Số lượng quá mức yêu cầu');

    orderDetail = new OrderDetail();
    orderDetail.order = order;
    orderDetail.watch = watch;
    orderDetail.sale = watch.sale;
    orderDetail.price = watch.price;
    orderDetail.quantity = createOrderDetailDto.quantity;
    await this.orderDetailService.update(orderDetail);
    return new JsonEntity(orderDetail);
  }
  @Put(':id/detail')
  @Authenticate(Role.Admin, Role.Employee, Role.User)
  async editOrderDetail(
    @Param() orderParamDto: OrderParamDto,
    @Body() editOrderDetailDto: EditOrderDetailDto,
  ) {
    const order = await this.orderService.findById(orderParamDto.id);
    if (!isDefined(order))
      throw new BadRequestException('Không tìm thấy đơn hàng');
    if (order.status != OrderStatus.WAIT_FOR_CONFIRMATION)
      throw new BadRequestException('Đơn hàng đã được xác nhận');

    const orderDetail = order.details.find(
      (detail) => detail.watchId == editOrderDetailDto.shoesId,
    );
    if (!isDefined(orderDetail))
      throw new BadRequestException('Chi tiết đơn hàng không tồn tại');

    if (orderDetail.watch.quantity < editOrderDetailDto.quantity)
      throw new BadRequestException('Số lượng quá mức yêu cầu');

    orderDetail.quantity = editOrderDetailDto.quantity;
    await this.orderDetailService.update(orderDetail);
    return new JsonEntity(orderDetail);
  }
  @Delete(':id/detail')
  @Authenticate(Role.Admin, Role.Employee, Role.User)
  async deleteOrderDetail(
    @Param() orderParamDto: OrderParamDto,
    @Body() deleteOrderDetail: DeleteOrderDetailDto,
  ) {
    const order = await this.orderService.findById(orderParamDto.id);
    if (!isDefined(order))
      throw new BadRequestException('Không tìm thấy đơn hàng');
    if (order.status != OrderStatus.WAIT_FOR_CONFIRMATION)
      throw new BadRequestException('Đơn hàng đã được xác nhận');

    const orderDetail = await this.orderDetailService.findById(
      order.orderId,
      deleteOrderDetail.shoesId,
    );
    if (!isDefined(orderDetail))
      throw new BadRequestException('Chi tiết đơn hàng không tồn tại');

    await this.orderDetailService.deleteById(
      orderDetail.orderId,
      deleteOrderDetail.shoesId,
    );
    return new JsonAction();
  }

  //Tìm kiếm đơn hàng của admin
  @Get()
  @Authenticate(Role.Admin, Role.Employee)
  async getOrder(@Query() getOrderDto: GetOrderDto) {
    const { limit, offset, ids, ownerIds, onlyAnonymous, fullName, sortBy } =
      getOrderDto;
    const data = await this.orderService
      .getPreBuiltFindAllQuery({
        limit,
        offset,
        ownerIds,
        ids,
        onlyAnonymous,
        fullName,
        sortBy,
      })
      .getManyAndCount();
    return new JsonCollection(data[0])
      .setLimit(limit)
      .setOffset(offset)
      .setTotal(data[1]);
  }

  @Get(':id')
  @Authenticate(Role.Admin, Role.Employee)
  async getOrderById(@Param() orderParamDto: OrderParamDto) {
    const data = await this.orderService
      .getPreBuiltFindAllQuery({
        ids: [orderParamDto.id],
        limit: 32,
        sortBy: {},
        offset: 0,
      })
      .getManyAndCount();
    return new JsonEntity(data[0][0]);
  }

  //Xoá đơn hàng của admin
  @Delete(':id')
  @Authenticate(Role.Admin, Role.Employee)
  async deleteOrder(@Param() orderParamDto: OrderParamDto) {
    await this.orderService.deleteById(orderParamDto.id);
    return new JsonAction();
  }
  @Post(':id/confirmOrder')
  @Authenticate(Role.Admin, Role.Employee)
  async updateStatus(@Param() orderParamDto: OrderParamDto) {
    const data = await this.orderService.updateStatus(
      orderParamDto.id,
      OrderStatus.CONFIRMED,
    );
    const order = await this.orderService.findById(orderParamDto.id);
    if (order.details.length > 0) {
      const shoesList = order.details.map((detail) => {
        detail.watch.quantity -= detail.quantity;
        return detail.watch;
      });
      await this.shoesService.getRepository().save(shoesList);
    }
    return new JsonEntity(data);
  }
}
