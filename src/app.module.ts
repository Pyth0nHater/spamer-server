// src/app.module.ts
import { Module } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
    providers: [TelegramService],
    imports: [DatabaseModule, UsersModule],
})
export class AppModule {}
