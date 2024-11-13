import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { Sessions } from './sessions.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sessions, User]), // Подключаем сущности к TypeOrmModule
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
