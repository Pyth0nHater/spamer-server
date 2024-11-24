import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mailing } from './mailing.entity';
import { User } from '../users/user.entity';
import { Sessions } from '../sessions/sessions.entity'; // Импорт сущности Session
import { CreateMailingDto } from '../dto/create-mailing.dto';
import { TelegramClient, Api } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { sleep } from '../utils/sleep';

@Injectable()
export class MailingService {
  constructor(
    @InjectRepository(Mailing)
    private readonly mailingRepository: Repository<Mailing>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Sessions)
    private readonly sessionRepository: Repository<Sessions>, // Репозиторий для работы с сессиями
  ) {}

  // Метод для сохранения рассылки
  async saveMailing(createMailingDto: CreateMailingDto): Promise<Mailing> {
    const { sessionId, messageText, folderId, batchSize, waitTime, userId } = createMailingDto;
  
    // Проверяем, существует ли пользователь
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
  
    // Получаем сессию по sessionId
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new Error('Session not found');
    }
  
    // Создаем новую рассылку
    const newMailing = this.mailingRepository.create({
      session,  // Сохраняем ссылку на сессию
      messageText,
      folderId,
      batchSize,
      waitTime,
      user,
      started: false, // Изначально рассылка не запущена
    });
  
    return await this.mailingRepository.save(newMailing);
  }
  
  // Метод для запуска рассылки
  async startMailing(mailingId: number): Promise<void> {
    const mailing = await this.mailingRepository.findOne({ where: { id: mailingId }, relations: ['session'] });
    if (!mailing) {
      throw new Error('Mailing not found');
    }
  
    if (mailing.started) {
      throw new Error('Mailing is already running');
    }
  
    mailing.started = true;
    await this.mailingRepository.save(mailing);
  
    try {
      await this.sendMessages(mailingId);
    } catch (error) {
      console.error('Error during mailing:', error);
    } finally {
      mailing.started = false;
      await this.mailingRepository.save(mailing);
    }
  }
  

  async deleteMailingById(mailingId: number): Promise<string> {
    const mailing = await this.mailingRepository.findOne({ where: { id: mailingId } });
    if (!mailing) {
      throw new Error(`Mailing with ID ${mailingId} not found`);
    }

    await this.mailingRepository.remove(mailing); // Удаляем рассылку

    return `Mailing with ID ${mailingId} has been deleted`;
  }

  // Метод для остановки рассылки
  async stopMailing(mailingId: number): Promise<void> {
    const mailing = await this.mailingRepository.findOne({ where: { id: mailingId } });
    if (!mailing) {
      throw new Error('Mailing not found');
    }

    if (!mailing.started) {
      throw new Error('Mailing is not running');
    }

    mailing.started = false;
    await this.mailingRepository.save(mailing);

    console.log('Mailing stopped successfully');
  }

  // Метод для получения информации о рассылке
  async getMailingById(mailingId: number): Promise<Mailing> {
    const mailing = await this.mailingRepository.findOne({ where: { id: mailingId }, relations: ['user'] });
    if (!mailing) {
      throw new Error(`Mailing with ID ${mailingId} not found`);
    }
    return mailing;
  }

  // Метод для получения всех рассылок
  async getAllMailings(): Promise<Mailing[]> {
    return this.mailingRepository.find({ relations: ['user'] });
  }

  async getMailingsByUserId(userId: number): Promise<Mailing[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    return this.mailingRepository.find({
      where: { user: user },
      relations: ['session'], // Здесь можно добавить другие связи, если нужно
    });
  }

  // Метод для отправки сообщений
 private async sendMessages(mailingId: number): Promise<void> {
  const mailing = await this.mailingRepository.findOne({ where: { id: mailingId }, relations: ['session'] });
  if (!mailing) {
    throw new Error('Mailing not found');
  }

  const { session, messageText, folderId, batchSize, waitTime, isCyclic } = mailing;

  // Проверяем наличие API_ID и API_HASH
  const API_ID = parseInt(process.env.API_ID, 10);
  const API_HASH = process.env.API_HASH;

  if (!API_ID || !API_HASH) {
    throw new Error('API_ID and API_HASH must be set in the environment variables');
  }

  // Используем sessionString из session
  const ownerSession = new StringSession(session.session); // Где session.session — это строка сессии
  const client = new TelegramClient(ownerSession, API_ID, API_HASH, {});

  await client.connect();

  try {
    const result: Api.messages.DialogFilters = await client.invoke(
      new Api.messages.GetDialogFilters(),
    );

    const filters = result.filters || [];
    const targetFilter: any = filters[folderId];

    if (!targetFilter?.includePeers) {
      console.error('No valid peers found in the specified filter');
      return;
    }

    const usernames = targetFilter.includePeers;

    // Флаг для отслеживания, если рассылка была вручную остановлена
    let stopMailing = false;

    // Основной цикл отправки сообщений
    const sendBatch = async () => {
      for (let i = 0; i < usernames.length; i += batchSize) {
        const batch = usernames.slice(i, i + batchSize);

        for (const username of batch) {
          if (!mailing.started) {
            console.log('Mailing stopped manually');
            stopMailing = true;
            return;
          }

          try {
            const entity = await client.getEntity(username);
            await client.sendMessage(entity, { message: messageText });

            if ('username' in entity && 'title' in entity) {
              console.log(`Message sent to @${entity.username} ${entity.title}`);
            } else {
              console.log('Entity does not have a username or title');
            }
          } catch (error) {
            console.error(`Error sending message to ${username}:`, error);
          }
        }

        if (i + batchSize < usernames.length) {
          console.log(`Waiting ${waitTime} seconds before the next batch...`);
          await sleep(waitTime * 1000);
        }
      }
    };

    // Запуск отправки сообщений
    await sendBatch();

    if (isCyclic && !stopMailing) {
      console.log('Mailing is cyclic, restarting the process...');
      await this.sendMessages(mailingId); // Перезапуск рассылки
    } else {
      console.log('All messages have been sent successfully');
    }

  } catch (error) {
    console.error('An error occurred while working with Telegram API:', error);
  } finally {
    await client.disconnect();
  }
}
  
}
