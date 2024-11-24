import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../dto/create-user.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneTelegram(telegramId: number): Promise<User> {
    return this.usersRepository.findOneBy({ telegramId });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  create(user: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }  
}