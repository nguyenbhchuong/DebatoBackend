import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import express, {Application} from 'express';
import authRotes from './routes/auth';
import CookieParser from 'cookie-parser';
import cors from 'cors';
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
