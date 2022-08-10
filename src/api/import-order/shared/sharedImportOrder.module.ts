import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportOrder } from '../entities/importOrder.entity';
import { ImportOrderDetail } from '../entities/importOrderDetail.entity';
import { ImportOrderService } from '../importOrder.service';
import { ImportOrderDetailService } from '../importOrderDetail.service';
import { ImportOrderExistContraint } from '../validators/importOrderExist.constraint';

@Module({
  imports: [TypeOrmModule.forFeature([ImportOrder, ImportOrderDetail])],
  providers: [
    ImportOrderService,
    ImportOrderDetailService,
    ImportOrderExistContraint,
  ],
  exports: [
    ImportOrderService,
    ImportOrderDetailService,
    ImportOrderExistContraint,
  ],
})
export class SharedImportOrderModule {}
