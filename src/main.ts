import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Укажите разрешенный источник (фронтенд)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные методы
    credentials: true, // Разрешить передачу cookie/авторизационных данных
  });
  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Spamer API')
    .setDescription('API для работы спамера по чатам')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
  console.log('Server is running...');
}
bootstrap();
