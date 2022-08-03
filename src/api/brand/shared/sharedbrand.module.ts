import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BrandService } from "../brand.service";
import { Brand } from "../entities/brand.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Brand])],
    providers:[BrandService],
    exports:[BrandService]
})
export class SharedBrandModule{}