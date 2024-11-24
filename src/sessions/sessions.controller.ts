import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from '../dto/create-session.dto';
import { Sessions } from './sessions.entity';
import { ApiOperation} from '@nestjs/swagger';


@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  // Эндпоинт для сохранения сессии
  @Post()
  @ApiOperation({ summary: 'Создать сессию' })
  async saveSession(@Body() session: CreateSessionDto): Promise<Sessions> {
    return this.sessionsService.saveSession(session);
  }

  // Эндпоинт для получения всех сессий 
  @Get('')
  @ApiOperation({ summary: 'Получить все сессии' })
  findAll(): Promise<Sessions[]> {
    return this.sessionsService.findAll();
  }

  // Эндпоинт для получения всех сессий одного пользователя
  @Get(':id')
  @ApiOperation({ summary: 'Получить все сессии одного пользователя' })
  async getUserSessions(@Param('id') userId: number): Promise<Sessions[]> {
    return this.sessionsService.getUserSessions(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить сессию по ID' })
  async deleteSessionById(@Param('id') userId: number): Promise<string> {
    return this.sessionsService.deleteSessionById(userId);
  }


}
