import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { CreateMailingDto } from '../dto/create-mailing.dto';
import { Mailing } from './mailing.entity';
import { ApiOperation } from '@nestjs/swagger';


@Controller('mailing')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  // Эндпоинт для создания новой рассылки
  @Post('create')
  @ApiOperation({ summary: 'Создать рассылку' })
  async saveMailing(@Body() createMailingDto: CreateMailingDto): Promise<Mailing> {
    return this.mailingService.saveMailing(createMailingDto);
  }

  // Эндпоинт для запуска рассылки
  @Post('start/:id')
  @ApiOperation({ summary: 'Запустить рассылку' })
  async startMailing(@Param('id') mailingId: number): Promise<string> {
    this.mailingService.startMailing(mailingId);
    return `Mailing with ID ${mailingId} has started`;
  }

  // Эндпоинт для остановки рассылки
  @Post('stop/:id')
  @ApiOperation({ summary: 'Остановить рассылку' })
  async stopMailing(@Param('id') mailingId: number): Promise<string> {
    await this.mailingService.stopMailing(mailingId);
    return `Mailing with ID ${mailingId} has been stopped`;
  }

  // Эндпоинт для получения информации о рассылке
  @Get(':id')
  @ApiOperation({ summary: 'Получить статуст рассылки' })
  async getMailing(@Param('id') mailingId: number): Promise<Mailing> {
    return this.mailingService.getMailingById(mailingId);
  }

  // Эндпоинт для получения списка всех рассылок
  @Get()
  @ApiOperation({ summary: 'Получить все рассылки' })
  async getAllMailings(): Promise<Mailing[]> {
    return this.mailingService.getAllMailings();
  }

  // Эндпоинт для получения всех рассылок для пользователя
  @Get('user/:userId')
  @ApiOperation({ summary: 'Получить все рассылки одного пользователя' })
  async getMailingsByUserId(@Param('userId') userId: number): Promise<Mailing[]> {
    return this.mailingService.getMailingsByUserId(userId);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Удалить рассылку по ID'})
  async deleteMailing(@Param('id') mailingId: number): Promise<string> {
    return this.mailingService.deleteMailingById(mailingId);
  }
}
