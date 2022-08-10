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
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { isDefined } from 'class-validator';
import { JsonAction } from 'src/shared/JsonAction';
import { JsonCollection } from 'src/shared/JsonCollection';
import { JsonEntity } from 'src/shared/JsonEntity';
import { Auth, AuthRequest } from '../auth/decorators/auth.decorator';
import { Authenticate } from '../auth/decorators/authenticate.decorator';
import { Role } from '../auth/enums/role.enum';
import { WatchService } from '../watch/watch.service';
import { User } from '../user/entities/user.entity';
import { CreateImportOrderDto } from './dtos/bodies/createImportOrder.dto';
import { CreateImportOrderDetailDto } from './dtos/bodies/createImportOrderDetail.dto';
import { DeleteImportOrderDetailDto } from './dtos/bodies/deleteImportOrderDetail.dto';
import { DeleteManyImportOrderDto } from './dtos/bodies/deleteManyImportOrder.dto';
import { EditImportOrderDto } from './dtos/bodies/editImportOrder.decorator';
import { EditImportOrderDetailDto } from './dtos/bodies/editImportOrderDetail.dto';
import { ImportOrderParamDto } from './dtos/params/importOrderParam.dto';
import { GetImportOrderDto } from './dtos/queries/getImportOrder.dto';
import { ImportOrder } from './entities/importOrder.entity';
import { ImportOrderDetail } from './entities/importOrderDetail.entity';
import { ImportOrderService } from './importOrder.service';
import { ImportOrderDetailService } from './importOrderDetail.service';

@ApiTags('Hoá đơn nhập')
@Controller('importOrder')
export class ImportOrderController {
  constructor(
    private readonly importOrderService: ImportOrderService,
    private readonly importOrderDetailService: ImportOrderDetailService,
    private readonly shoesService: WatchService,
  ) {}

  @Get()
  @Authenticate(Role.Admin, Role.Employee)
  async getImportOrder(@Query() getImportOrderDto: GetImportOrderDto) {
    const { limit, offset, ids, creatorIds } = getImportOrderDto;
    const data = await this.importOrderService.findAll({
      limit,
      offset,
      ids,
      creatorIds,
    });
    return new JsonCollection(data[0].map((data) => instanceToPlain(data)))
      .setLimit(limit)
      .setOffset(offset)
      .setTotal(data[1]);
  }

  @Post()
  @Authenticate(Role.Admin, Role.Employee)
  async createImportOrder(
    @Auth() auth: AuthRequest,
    @Body() createImportOrderDto: CreateImportOrderDto,
  ) {
    const importOrder = plainToInstance(ImportOrder, createImportOrderDto);
    const user = new User();
    user.userId = auth.userId;
    importOrder.creator = user;
    await this.importOrderService.update(importOrder);
    return new JsonEntity(importOrder);
  }
  @Put(':id')
  @Authenticate(Role.Admin, Role.Employee)
  async editImportOrder(
    @Body() editImportOrderDto: EditImportOrderDto,
    @Param() importOrderParamDto: ImportOrderParamDto,
  ) {
    const importOrder = await this.importOrderService.findById(
      importOrderParamDto.id,
    );
    const data = plainToInstance(ImportOrder, {
      ...importOrder,
      ...editImportOrderDto,
    });
    await this.importOrderService.update(importOrder);
    return new JsonEntity(importOrder);
  }

  @Post(':id/detail')
  @Authenticate(Role.Admin, Role.Employee)
  async createImportOrderDetail(
    @Body() createImportOrderDetail: CreateImportOrderDetailDto,
    @Param() importOrderParamDto: ImportOrderParamDto,
  ) {
    let importDetail = await this.importOrderDetailService.findById(
      importOrderParamDto.id,
      createImportOrderDetail.shoesId,
    );
    if (isDefined(importDetail))
      throw new BadRequestException('Chi tiết giày đã tồn tại');
    importDetail = new ImportOrderDetail();
    importDetail.importOrderId = importOrderParamDto.id;
    importDetail.shoesId = createImportOrderDetail.shoesId;
    importDetail.quantity = createImportOrderDetail.quantity;
    await this.importOrderDetailService.update(importDetail);

    return new JsonEntity(importDetail);
  }
  @Put(':id/detail')
  @Authenticate(Role.Admin, Role.Employee)
  async editImportOrderDetail(
    @Body() editImportOrderDetailDto: EditImportOrderDetailDto,
    @Param() importOrderParamDto: ImportOrderParamDto,
  ) {
    const importDetail = await this.importOrderDetailService.findById(
      importOrderParamDto.id,
      editImportOrderDetailDto.shoesId,
    );
    if (!isDefined(importDetail))
      throw new BadRequestException('Chi tiết giày không tồn tại');

    importDetail.quantity = editImportOrderDetailDto.quantity;
    await this.importOrderDetailService.update(importDetail);

    return new JsonEntity(instanceToPlain(importDetail));
  }
  @Delete(':id/detail')
  @Authenticate(Role.Admin, Role.Employee)
  async deleteImportOrderDetail(
    @Body() deleteImportOrderDetail: DeleteImportOrderDetailDto,
    @Param() importOrderParamDto: ImportOrderParamDto,
  ) {
    const importDetail = await this.importOrderDetailService.findById(
      importOrderParamDto.id,
      deleteImportOrderDetail.shoesId,
    );
    if (!isDefined(importDetail))
      throw new BadRequestException('Chi tiết giày không tồn tại');

    await this.importOrderDetailService.deleteById(
      importDetail.importOrderId,
      importDetail.shoesId,
    );

    return new JsonAction();
  }

  @Delete(':id')
  @Authenticate(Role.Admin, Role.Employee)
  async deleteImportOrder(@Param() importOrderParamDto: ImportOrderParamDto) {
    await this.importOrderService.deleteById(importOrderParamDto.id);
    return new JsonAction();
  }

  @Delete()
  @Authenticate(Role.Admin, Role.Employee)
  async deleteManyImportOrder(
    @Body() deleteManyImportOrderDto: DeleteManyImportOrderDto,
  ) {
    await this.importOrderService.deleteMany(deleteManyImportOrderDto.ids);
    return new JsonAction();
  }

  @Post(':id/invoke')
  @Authenticate(Role.Admin, Role.Employee)
  async invokeChanges(@Param() importOrderParamDto: ImportOrderParamDto) {
    const importOrder = await this.importOrderService.findById(
      importOrderParamDto.id,
    );
    if (importOrder.details.length > 0) {
      const shoesList = importOrder.details.map((detail) => {
        detail.shoes.quantity += detail.quantity;
        return detail.shoes;
      });
      await this.shoesService.getRepository().save(shoesList);
    }
    return new JsonAction();
  }
}
