import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICRUDService } from 'src/shared/interfaces/ICRUDService.interface';
import { IFindAllOptions } from 'src/shared/interfaces/IFindAllOptions.interface';
import { ILike, In, Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';

interface FindAllBrandOptions extends IFindAllOptions {
  brandName?: string;
}

@Injectable()
export class BrandService implements ICRUDService<Brand> {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}
  async findById(id: string): Promise<Brand> {
    return await this.brandRepository.findOne({ where: { brandId: id } });
  }
  async findAll(options: FindAllBrandOptions): Promise<[Brand[], number]> {
    return await this.brandRepository.findAndCount({
      skip: options.offset,
      take: options.limit,
      where: options.brandName
        ? { brandName: ILike(`%${options.brandName}%`) }
        : {},
    });
  }
  async update(value: Brand): Promise<Brand> {
    await this.brandRepository.save(value);
    return value;
  }
  async deleteById(id: string): Promise<void> {
    await this.brandRepository.delete({ brandId: id });
  }
  async deleteMany(ids: string[]): Promise<void> {
    await this.brandRepository.delete({ brandId: In(ids) });
  }
  getRepository(): Repository<Brand> {
    return this.brandRepository;
  }
}
