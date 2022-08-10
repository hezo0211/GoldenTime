import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICRUDService } from 'src/shared/interfaces/ICRUDService.interface';
import { IFindAllOptions } from 'src/shared/interfaces/IFindAllOptions.interface';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';

interface FindAllUserOptions extends IFindAllOptions {
  ids?: string[];
  fullName?: string;
}

interface UserExistOptions {
  email?: string;
  username?: string;
}

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
  async findAll(options: FindAllUserOptions): Promise<[User[], number]> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .skip(options.offset)
      .take(options.limit);
    if (options.ids.length > 0) queryBuilder.whereInIds(options.ids);
    if (options.fullName)
      queryBuilder.andWhere(
        " user.lastName || ' ' || user.firstName ILIKE :fullName",
        { fullName: `%${options.fullName}%` },
      );
    return await queryBuilder.getManyAndCount();
  }
  async update(value: User): Promise<User> {
    await this.userRepository.save(value);
    return value;
  }
  async deleteById(id: string): Promise<void> {
    await this.userRepository.delete({ userId: id });
  }
  async deleteMany(ids: string[]) {
    await this.userRepository.delete({ userId: In(ids) });
  }
  async activeUser(id: string): Promise<void> {
    await this.userRepository.update({ userId: id }, { isActive: true });
  }
}
