import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Authenticate } from '../auth/decorators/authenticate.decorator';
import { Role } from '../auth/enums/role.enum';
import { UserService } from './user.service';

@ApiTags('Người dùng')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Authenticate(Role.Admin, Role.Employee)
  async getUsers() {}

  @Post()
  @Authenticate(Role.Admin, Role.Employee)
  async createUser() {}

  @Put()
  @Authenticate(Role.Admin, Role.Employee)
  async updateUser() {}

  @Delete()
  @Authenticate(Role.Admin, Role.Employee)
  async removeUser() {}
}
