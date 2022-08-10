import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from '../category.service';
import { Category } from '../entities/category.entity';
import { CategoryExistContraint } from '../validators/categoryExist.constraint';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService, CategoryExistContraint],
  exports: [CategoryService, CategoryExistContraint],
})
export class SharedCategoryModule {}
