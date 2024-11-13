import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { User } from './user.entity';
import { Sessions } from 'src/sessions/sessions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Sessions])],
  providers: [UserService],
  controllers: [UserController],
})
export class UsersModule {}