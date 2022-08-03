import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "../entities/order.entity";
import { OrderDetail } from "../entities/orderdetail.entity";
import { OrderService } from "../order.service";

@Module({
    imports:[TypeOrmModule.forFeature([Order,OrderDetail])],
    providers:[OrderService],
    exports:[OrderService]
})
export class SharedOrderModule{}