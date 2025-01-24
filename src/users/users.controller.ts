import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    type: [User],
  })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Информация о пользователе',
    type: User,
  })
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Get('telegram/:id')
  @ApiOperation({ summary: 'Получить пользователя по Telegram ID' })
  @ApiParam({ name: 'id', description: 'Telegram ID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Информация о пользователе',
    type: User,
  })
  findOneTelegram(@Param('id') id: number): Promise<User | 0> {
    return this.userService.findOneTelegram(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Созданный пользователь',
    type: User,
  })
  create(@Body() user: CreateUserDto): Promise<User> {
    return this.userService.create(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя по ID' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ status: 204, description: 'Пользователь успешно удалён' })
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
