import { Module } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';
import { MailingModule } from './mailing/mailing.module';
import { PaymentModule } from './payment/payment.module';

@Module({
    providers: [TelegramService],
    imports: [DatabaseModule, UsersModule, SessionsModule, MailingModule, PaymentModule],
    controllers: [],
})
export class AppModule {}
