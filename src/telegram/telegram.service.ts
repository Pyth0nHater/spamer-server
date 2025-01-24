import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';


@Injectable()
export class TelegramService implements OnModuleInit {
    private bot: TelegramBot;

    // Replace with your actual Telegram bot token
    private readonly botToken = "6807558708:AAEapTJk9thUr6NIIUxn8WRxpx1aoI7pnhs";
    private readonly webAppUrl = 'https://sad-socks-hammer.loca.lt/home';


    onModuleInit() {
        this.bot = new TelegramBot(this.botToken, { polling: true });

        this.bot.onText(/\/start/, (msg) => {
            const chatId = msg.chat.id;
            this.bot.sendMessage(chatId, 'Hi its spamer bot =)', {
                reply_markup: {
                  inline_keyboard: [
                    [{ text: 'Launch app', web_app: { url: this.webAppUrl } }]
                  ]
                }
              });
            });


        this.bot.on('message', (msg) => {
            const chatId = msg.chat.id;
            if (!msg.text?.startsWith('/start')) {
                this.bot.sendMessage(chatId, 'Type /start to launch in spamer bot');
            }
        });

        console.log('Telegram bot is running...');
    }
}
