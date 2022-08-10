import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICRUDService } from 'src/shared/interfaces/ICRUDService.interface';
import { IFindAllOptions } from 'src/shared/interfaces/IFindAllOptions.interface';
import { ILike, In, Repository } from 'typeorm';
import { Category } from './entities/category.entity';

interface FindAllCategoryOptions extends IFindAllOptions {
  categoryName?: string;
}

@Injectable()
export class CategoryService implements ICRUDService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async findById(id: string): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { categoryId: id } });
  }
  async findAll(
    options: FindAllCategoryOptions,
  ): Promise<[Category[], number]> {
    return await this.categoryRepository.findAndCount({
      skip: options.offset,
      take: options.limit,
      where: options.categoryName
        ? { categoryName: ILike(`%${options.categoryName}%`) }
        : {},
    });
  }
  async update(value: Category): Promise<Category> {
    await this.categoryRepository.save(value);
    return value;
  }
  async deleteById(id: string): Promise<void> {
    await this.categoryRepository.delete({ categoryId: id });
  }
  async deleteMany(ids: string[]): Promise<void> {
    await this.categoryRepository.delete({ categoryId: In(ids) });
  }
  getRepository(): Repository<Category> {
    return this.categoryRepository;
  }
}
