import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  register(email: string, password: string, repassword: string): string {
    //Check fields
    if (!email || !password || !repassword) {
      return 'All fields must be filled';
    }
    //Check Database if Email already existed
    //Save new to Database
    return 'Register Successfully';

  }

  login(email: string, password: string): string {
    //Check fields
    if (!email || !password) {
      return 'All fields must be filled';
    }
    //Check if user's info fit the Database
    return 'Login Successfully';
  }
}

