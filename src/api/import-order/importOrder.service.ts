import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICRUDService } from 'src/shared/interfaces/ICRUDService.interface';
import { IFindAllOptions } from 'src/shared/interfaces/IFindAllOptions.interface';
import { In, Repository } from 'typeorm';
import { ImportOrder } from './entities/importOrder.entity';

class ImportOrderFindAllOptions implements IFindAllOptions {
  limit: number;
  offset: number;
  ids: string[];
  creatorIds: string[];
}

@Injectable()
export class ImportOrderService implements ICRUDService<ImportOrder> {
  constructor(
    @InjectRepository(ImportOrder)
    private readonly importOrderRepository: Repository<ImportOrder>,
  ) {}
  async findById(id: string): Promise<ImportOrder> {
    return await this.importOrderRepository.findOne({
      where: { importOrderId: id },
      relations: {
        creator: true,
        details: {
          shoes: true,
        },
      },
    });
  }
  async findAll(
    options: ImportOrderFindAllOptions,
  ): Promise<[ImportOrder[], number]> {
    const queryBuilder =
      this.importOrderRepository.createQueryBuilder('importOrder');
    queryBuilder
      .leftJoinAndSelect('importOrder.details', 'details')
      .leftJoinAndSelect('details.shoes', 'shoes')
      .leftJoinAndSelect('importOrder.creator', 'creator')
      .skip(options.offset)
      .take(options.limit);
    if (options.ids.length > 0) queryBuilder.whereInIds(options.ids);
    if (options.creatorIds.length > 0)
      queryBuilder.andWhere('creator.userId IN (:...creatorIds)', {
        creatorIds: options.creatorIds,
      });
    return await queryBuilder.getManyAndCount();
  }
  async update(value: ImportOrder): Promise<ImportOrder> {
    await this.importOrderRepository.save(value);
    return value;
  }
  async deleteById(id: string): Promise<void> {
    await this.importOrderRepository.delete({ importOrderId: id });
  }
  async deleteMany(ids: string[]): Promise<void> {
    await this.importOrderRepository.delete({ importOrderId: In(ids) });
  }
  getRepository(): Repository<ImportOrder> {
    return this.importOrderRepository;
  }
}
