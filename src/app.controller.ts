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
  async register(email, password, repassword){
    return this.appService.register({email, password, repassword});
  }
  @Post('login')
  async login(email, password){
    return this.appService.login({email, password});
  }
}
