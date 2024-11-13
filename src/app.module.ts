import { Module } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';
import { MailingService } from './mailing/mailing.service';
import { MailingModule } from './mailing/mailing.module';

@Module({
    providers: [TelegramService],
    imports: [DatabaseModule, UsersModule, SessionsModule, MailingModule],
    controllers: [],
})
export class AppModule {}
