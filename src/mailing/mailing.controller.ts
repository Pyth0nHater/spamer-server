import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { CreateMailingDto } from '../dto/create-mailing.dto';
import { Mailing } from './mailing.entity';

@Controller('mailing')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  // Эндпоинт для сохранения рассылки
  @Post('create')
  async saveMailing(@Body() createMailingDto: CreateMailingDto): Promise<Mailing> {
    return this.mailingService.saveMailing(createMailingDto);
  }

  // Эндпоинт для отправки сообщений
  @Post('start/:id')
  async sendMessages(
    @Param('mailingId') mailingId: number,
  ): Promise<void> {
    return this.mailingService.sendMessages(mailingId);
  }
}