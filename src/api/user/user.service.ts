import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICRUDService } from 'src/shared/interfaces/ICRUDService.interface';
import { IFindAllOptions } from 'src/shared/interfaces/IFindAllOptions.interface';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService implements ICRUDService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getRepository(): Repository<User> {
    return this.userRepository;
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { userId: id } });
  }
  async findAll(options: IFindAllOptions): Promise<[User[], number]> {
    return await this.userRepository.findAndCount({
      skip: options.offset,
      take: options.limit,
    });
  }
  async update(value: User): Promise<User> {
    await this.userRepository.save(value);
    return value;
  }
  async deleteById(id: string): Promise<void> {
    await this.userRepository.delete({ userId: id });
  }

  async activeUser(id: string): Promise<void> {
    await this.userRepository.update({ userId: id }, { isActive: true });
  }
}
