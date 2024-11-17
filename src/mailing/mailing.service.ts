import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mailing } from './mailing.entity';
import { User } from '../users/user.entity';
import { CreateMailingDto } from '../dto/create-mailing.dto';
import { TelegramClient } from "telegram";
import { StringSession } from 'telegram/sessions';
import { sleep } from '../utils/sleep'

@Injectable()
export class MailingService {
  constructor(
    @InjectRepository(Mailing)
    private readonly mailingRepository: Repository<Mailing>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Метод для сохранения рассылки
  async saveMailing(createMailingDto: CreateMailingDto): Promise<Mailing> {
    const { session, messageText, usernames, batchSize, waitTime, userId } = createMailingDto;

    // Проверяем, существует ли пользователь
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const newMailing = this.mailingRepository.create({
      session,
      messageText,
      usernames,
      batchSize,
      waitTime,
      user,
    });

    return await this.mailingRepository.save(newMailing);
  }

  // Метод для отправки сообщений
  async sendMessages(mailingId: number): Promise<void> {
    const mailing = await this.mailingRepository.findOne({ where: { id: mailingId} });
    if (!mailing) {
      throw new Error('Mailing not found or you do not have access to it');
    }

    const {session, messageText, usernames, batchSize, waitTime } = mailing;

    // Ваши API_ID и API_HASH из .env
    const API_ID = parseInt(process.env.API_ID);
    const API_HASH = process.env.API_HASH;
    const ownerSession = new StringSession(session); // Добавьте актуальную строку сессии владельца

    const client = new TelegramClient(ownerSession, API_ID, API_HASH, {});

    await client.connect();

    // Отправляем сообщение
    for (let i = 0; i < usernames.length; i += batchSize) {
      const batch = usernames.slice(i, i + batchSize);
      for (const username of batch) {
        try {
          const entity = await client.getEntity(username);
          await sleep(200); // задержка между отправками
          await client.sendMessage(entity, { message: messageText });
          console.log(`Сообщение отправлено: ${username}`);
        } catch (error) {
          console.error(`Ошибка при отправке сообщения ${username}:`, error);
        }
      }

      // Задержка между партиями
      if (i + batchSize < usernames.length) {
        console.log(`Ожидание ${waitTime / 1000} секунд перед следующей партией...`);
        await sleep(waitTime);
      }
    }

    console.log('Все сообщения отправлены');
  }
}
