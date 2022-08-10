import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandService } from '../brand.service';
import { Brand } from '../entities/brand.entity';
import { BrandExistContraint } from '../validators/brandExist.contraint';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  providers: [BrandService, BrandExistContraint],
  exports: [BrandService, BrandExistContraint],
})
export class SharedBrandModule {}
