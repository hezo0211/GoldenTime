import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICRUDService } from 'src/shared/interfaces/ICRUDService.interface';
import { IFindAllOptions } from 'src/shared/interfaces/IFindAllOptions.interface';
import { In, Repository } from 'typeorm';
import { Watch } from './entities/watch.entity';

class WatchFindAllOptions implements IFindAllOptions {
  limit: number;
  offset: number;
  ids: string[];
  watchName?: string;
  categoryIds?: string[];
  price?: {
    from: number;
    to?: number;
  };
  size?: number;
}

@Injectable()
export class WatchService implements ICRUDService<Watch> {
  constructor(
    @InjectRepository(Watch)
    private readonly watchRepository: Repository<Watch>,
  ) {}
  async findById(id: string): Promise<Watch> {
    return await this.watchRepository.findOne({
      where: { watchId: id },
      relations: { brand: true, categories: true },
    });
  }
  async findAll(options: WatchFindAllOptions): Promise<[Watch[], number]> {
    const query = this.watchRepository.createQueryBuilder('watch');
    query
      .leftJoinAndSelect('watch.brand', 'brand')
      .leftJoinAndSelect('watch.categories', 'categories')
      .skip(options.offset)
      .take(options.limit);
    if (options.ids) query.andWhereInIds(options.ids);
    if (options.watchName)
      query.andWhere('watch.watchName ILIKE :name', {
        name: `%${options.watchName}%`,
      });
    if (options.categoryIds)
      query.andWhere('categories.categoryId IN (:...categoryIds)', {
        categoryIds: options.categoryIds,
      });
    if (options.price) {
      query.andWhere('watch.price >= :fromPrice', {
        fromPrice: options.price.from,
      });
      if (options.price.to)
        query.andWhere('watch.price <= :toPrice', {
          toPrice: options.price.to,
        });
    }
    if (options.size)
      query.andWhere('watch.size = :size', { size: options.size });
    return await query.getManyAndCount();
  }
  async update(value: Watch): Promise<Watch> {
    await this.watchRepository.save(value);
    return value;
  }
  async deleteById(id: string): Promise<void> {
    await this.watchRepository.delete({ watchId: id });
  }
  async deleteMany(ids: string[]): Promise<void> {
    await this.watchRepository.delete({ watchId: In(ids) });
  }
  getRepository(): Repository<Watch> {
    return this.watchRepository;
  }
  async addQuantity(id: string, quantity: number): Promise<void> {
    await this.watchRepository.update(
      { watchId: id },
      { quantity: () => `quantity + ${quantity}` },
    );
  }
}
