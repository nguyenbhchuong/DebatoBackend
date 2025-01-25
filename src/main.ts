import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  require('dotenv').config();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Debato API')
    .setDescription('The Debato API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configure CORS with credentials
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:4200',
    ].filter(Boolean),
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
