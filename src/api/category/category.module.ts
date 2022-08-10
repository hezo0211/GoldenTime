import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { SharedCategoryModule } from './shared/sharedCategory.module';

@Module({
  imports: [SharedCategoryModule],
  controllers: [CategoryController],
})
export class CategoryModule {}
