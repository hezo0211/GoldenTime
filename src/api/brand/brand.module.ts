import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { SharedBrandModule } from './shared/sharedBrand.module';

@Module({
  imports: [SharedBrandModule],
  controllers: [BrandController],
})
export class BrandModule {}
