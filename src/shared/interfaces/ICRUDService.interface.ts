import { Repository } from 'typeorm';
import { IFindAllOptions } from './IFindAllOptions.interface';

export interface ICRUDService<T> {
  findById(id: string): T | Promise<T>;
  findAll(options: IFindAllOptions): [T[], number] | Promise<[T[], number]>;
  update(value: T): T | Promise<T>;
  deleteById(id: string): void | Promise<void>;
  getRepository(): Repository<T>;
}
