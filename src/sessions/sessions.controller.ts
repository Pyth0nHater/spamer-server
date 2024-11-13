import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from '../dto/create-session.dto';
import { Sessions } from './sessions.entity';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  // Эндпоинт для сохранения сессии
  @Post()
  async saveSession(@Body() session: CreateSessionDto): Promise<Sessions> {
    return this.sessionsService.saveSession(session);
  }

  // Эндпоинт для получения всех сессий одного пользователя
  @Get(':id')
  async getUserSessions(@Param('id') userId: number): Promise<Sessions[]> {
    return this.sessionsService.getUserSessions(userId);
  }
}
