import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { CreateMailingDto } from '../dto/create-mailing.dto';
import { Mailing } from './mailing.entity';

@Controller('mailing')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  // Эндпоинт для создания новой рассылки
  @Post('create')
  async saveMailing(@Body() createMailingDto: CreateMailingDto): Promise<Mailing> {
    return this.mailingService.saveMailing(createMailingDto);
  }

  // Эндпоинт для запуска рассылки
  @Post('start/:id')
  async startMailing(@Param('id') mailingId: number): Promise<string> {
    this.mailingService.startMailing(mailingId);
    return `Mailing with ID ${mailingId} has started`;
  }

  // Эндпоинт для остановки рассылки
  @Post('stop/:id')
  async stopMailing(@Param('id') mailingId: number): Promise<string> {
    await this.mailingService.stopMailing(mailingId);
    return `Mailing with ID ${mailingId} has been stopped`;
  }

  // Эндпоинт для получения информации о рассылке
  @Get(':id')
  async getMailing(@Param('id') mailingId: number): Promise<Mailing> {
    return this.mailingService.getMailingById(mailingId);
  }

  // Эндпоинт для получения списка всех рассылок
  @Get()
  async getAllMailings(): Promise<Mailing[]> {
    return this.mailingService.getAllMailings();
  }
}
