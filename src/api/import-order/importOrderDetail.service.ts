import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportOrderDetail } from './entities/importOrderDetail.entity';

@Injectable()
export class ImportOrderDetailService {
  constructor(
    @InjectRepository(ImportOrderDetail)
    private readonly importOrderDetailRepository: Repository<ImportOrderDetail>,
  ) {}
  async findById(id: string, shoesId: string): Promise<ImportOrderDetail> {
    return await this.importOrderDetailRepository.findOne({
      where: { importOrderId: id, shoesId: shoesId },
    });
  }
  async update(value: ImportOrderDetail): Promise<ImportOrderDetail> {
    await this.importOrderDetailRepository.save(value);
    return value;
  }
  async deleteById(id: string, shoesId: string): Promise<void> {
    await this.importOrderDetailRepository.delete({
      shoesId: shoesId,
      importOrderId: id,
    });
  }
  getRepository(): Repository<ImportOrderDetail> {
    return this.importOrderDetailRepository;
  }
}
