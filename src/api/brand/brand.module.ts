import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { SharedBrandModule } from './shared/sharedbrand.module';

@Module({
  controllers: [BrandController],
  imports: [SharedBrandModule]
})
export class BrandModule {}
