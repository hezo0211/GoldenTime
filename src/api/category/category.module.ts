import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { SharedCategoryModule } from './shared/sharedcategory.module';

@Module({
  controllers: [CategoryController],
  imports: [SharedCategoryModule]
})
export class CategoryModule {}
