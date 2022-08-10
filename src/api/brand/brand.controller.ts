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
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dtos/bodies/createBrand.dto';
import { DeleteManyBrandDto } from './dtos/bodies/deleteManyBrand.dto';
import { EditBrandDto } from './dtos/bodies/editBrand.dto';
import { BrandParamDto } from './dtos/params/brandParam.dto';
import { GetBrandDto } from './dtos/queries/getBrand.dto';
import { Brand } from './entities/brand.entity';

@ApiTags('Thương hiệu')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async getBrand(@Query() getBrandDto: GetBrandDto) {
    const { limit, offset, brandName } = getBrandDto;
    const data = await this.brandService.findAll({ limit, offset, brandName });
    return new JsonCollection<Brand>(data[0])
      .setLimit(limit)
      .setOffset(offset)
      .setTotal(data[1]);
  }

  @Get(':id')
  async getBrandById(@Param() brandParamDto: BrandParamDto) {
    const data = await this.brandService.findById(brandParamDto.id);
    return new JsonEntity(data);
  }

  @Post()
  async createBrand(@Body() createBrandDto: CreateBrandDto) {
    const brand = plainToInstance(Brand, createBrandDto);
    await this.brandService.update(brand);
    return new JsonEntity(brand);
  }

  @Put(':id')
  async editBrand(
    @Param() brandParamDto: BrandParamDto,
    @Body() editBrandDto: EditBrandDto,
  ) {
    let brand = await this.brandService.findById(brandParamDto.id);
    brand = plainToInstance(Brand, { ...brand, ...editBrandDto });
    await this.brandService.update(brand);
    return new JsonEntity(brand);
  }

  @Delete(':id')
  async deleteBrand(@Param() brandParamDto: BrandParamDto) {
    await this.brandService.deleteById(brandParamDto.id);
    return new JsonAction();
  }
  @Delete()
  async deleteManyBrand(@Body() deleteManyBrandDto: DeleteManyBrandDto) {
    await this.brandService.deleteMany(deleteManyBrandDto.ids);
    return new JsonAction();
  }
}
