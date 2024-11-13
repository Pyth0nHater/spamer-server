import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mailing } from './mailing.entity';
import { MailingService } from './mailing.service';
import { MailingController } from './mailing.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mailing, User])],
  providers: [MailingService],
  controllers: [MailingController],
})
export class MailingModule {}
