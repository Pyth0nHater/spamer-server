import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sessions } from './sessions.entity';
import { CreateSessionDto } from '../dto/create-session.dto';
import { User } from '../users/user.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Sessions)
    private sessionsRepository: Repository<Sessions>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async saveSession(sessionData: CreateSessionDto): Promise<Sessions> {
    const { userId, session, name } = sessionData;

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const newSession = this.sessionsRepository.create({
      session,
      name,
      user,
    });
    return this.sessionsRepository.save(newSession);
  }

  // Метод для получения всех сессий пользователя
  async getUserSessions(userId: number): Promise<Sessions[]> {
    return this.sessionsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
