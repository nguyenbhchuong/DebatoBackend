import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('register')
  register(email, password, repassword): string {
    return this.appService.register(email, password, repassword);
  }
  @Post('login')
  login(email, password): string {
    return this.appService.login(email, password);
  }
}
