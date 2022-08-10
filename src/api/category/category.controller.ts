import {
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
import { plainToInstance } from 'class-transformer';
import { JsonAction } from 'src/shared/JsonAction';
import { JsonCollection } from 'src/shared/JsonCollection';
import { JsonEntity } from 'src/shared/JsonEntity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/bodies/createCategory.dto';
import { DeleteManyCategoryDto } from './dtos/bodies/deleteManyCategory.dto';
import { EditCategoryDto } from './dtos/bodies/editCategory.dto';
import { CategoryParamDto } from './dtos/params/categoryParam.dto';
import { GetCategoryDto } from './dtos/queries/getCategory.dto';
import { Category } from './entities/category.entity';

@ApiTags('Loại đồng hồ')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategory(@Query() getCategoryDto: GetCategoryDto) {
    const { limit, offset, categoryName } = getCategoryDto;
    const data = await this.categoryService.findAll({
      limit,
      offset,
      categoryName,
    });
    return new JsonCollection<Category>(data[0])
      .setLimit(limit)
      .setOffset(offset)
      .setTotal(data[1]);
  }
  @Get(':id')
  async getCategoryById(@Param() categoryParam: CategoryParamDto) {
    const data = await this.categoryService.findById(categoryParam.id);
    return new JsonEntity(data);
  }

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const data = plainToInstance(Category, createCategoryDto);
    await this.categoryService.update(data);
    return new JsonEntity(data);
  }

  @Put(':id')
  async editCategory(
    @Param() categoryParamDto: CategoryParamDto,
    @Body() editCategoryDto: EditCategoryDto,
  ) {
    let data = await this.categoryService.findById(categoryParamDto.id);
    data = plainToInstance(Category, { ...data, ...editCategoryDto });
    await this.categoryService.update(data);
    return new JsonEntity(data);
  }

  @Delete(':id')
  async deleteCategory(@Param() categoryParamDto: CategoryParamDto) {
    await this.categoryService.deleteById(categoryParamDto.id);
    return new JsonAction();
  }

  @Delete()
  async deleteManyCategory(
    @Body() deleteManyCategoryDto: DeleteManyCategoryDto,
  ) {
    await this.categoryService.deleteMany(deleteManyCategoryDto.ids);
    return new JsonAction();
  }
}
