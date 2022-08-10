import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JsonAction } from 'src/shared/JsonAction';
import { JsonCollection } from 'src/shared/JsonCollection';
import { JsonEntity } from 'src/shared/JsonEntity';
import { Auth, AuthRequest } from '../auth/decorators/auth.decorator';
import { Authenticate } from '../auth/decorators/authenticate.decorator';
import { Role } from '../auth/enums/role.enum';
import { CreateUserDto } from './dtos/bodies/createUser.dto';
import { DeleteManyUserDto } from './dtos/bodies/deleteManyUser.dto';
import { GetUserDto } from './dtos/queries/getUser.dto';
import { UserExistDto } from './dtos/queries/userExist.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('Người dùng')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Authenticate(Role.Admin, Role.Employee)
  async getUsers(@Query() getUserDto: GetUserDto) {
    const { ids, limit, offset, fullName } = getUserDto;
    const data = await this.userService.findAll({
      ids,
      limit,
      offset,
      fullName,
    });
    return new JsonCollection(data[0])
      .setLimit(getUserDto.limit)
      .setOffset(getUserDto.offset)
      .setTotal(data[1]);
  }

  @Get('me')
  @Authenticate(Role.Admin, Role.Employee, Role.User)
  async getMe(@Auth() auth: AuthRequest) {
    const user = await this.userService.findById(auth.userId);
    return new JsonEntity(user);
  }

  @Post()
  @Authenticate(Role.Admin, Role.Employee)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = plainToInstance(User, createUserDto);
    await this.userService.update(user);
    return new JsonEntity(user);
  }

  @Get('exist')
  @Authenticate(Role.Admin, Role.Employee)
  async userExist(@Query() userExistDto: UserExistDto) {
    return new JsonAction();
  }

  @Put()
  @Authenticate(Role.Admin, Role.Employee)
  async updateUser() {}

  @Delete()
  @Authenticate(Role.Admin, Role.Employee)
  async removeUser(@Body() deleteManyUserDto: DeleteManyUserDto) {
    await this.userService.deleteMany(deleteManyUserDto.ids);
    return new JsonAction();
  }
}
