import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express, {Application} from 'express';
import authRotes from './routes/auth';
import CookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();


const MongoDB_connection_string = 'mongodb://localhost';

async function connecttoMongoDB(connection_string: string) {
  await mongoose.connect(connection_string);
  console.log('Connected');
}
try {
  connecttoMongoDB(MongoDB_connection_string);
} catch (e) {
  console.log('Error: ', e)
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
