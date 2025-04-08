import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // 👈 импорт Swagger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // ✅ Swagger конфигурация
  const config = new DocumentBuilder()
    .setTitle('Medival Game API')
    .setDescription('API для управления игроками и юнитами')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // <-- доступно по /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
