import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { sign } from 'jsonwebtoken';
import { AuthPayload } from '../auth.payload';
import { CookieOptions } from 'express';

export enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthService {
  private readonly JWT_SECRET_KEY = process.env.JWT_KEY; // <- replace this with your secret key

  constructor() {}

  async validateOAuthLogin(
    thirdPartyId: string,
    provider: Provider,
  ): Promise<{ token: string; cookieOptions: CookieOptions }> {
    try {
      // You can add some registration logic here,
      // to register the user using their thirdPartyId (in this case their googleId)
      // let user: IUser = await this.usersService.findOneByThirdPartyId(thirdPartyId, provider);

      // if (!user)
      // user = await this.usersService.registerOAuthUser(thirdPartyId, provider);

      const payload = {
        thirdPartyId,
        provider,
      };

      const jwt: string = sign(payload, this.JWT_SECRET_KEY, {
        expiresIn: '1d',
      });

      return {
        token: jwt,
        cookieOptions: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' as const,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        },
      };
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }

  login(
    userID: string,
    email?: string,
    provider: string = 'jwt',
  ): { token: string; cookieOptions: CookieOptions } {
    const payload = {
      sub: userID,
      email,
      provider,
    };

    const jwt: string = sign(payload, this.JWT_SECRET_KEY, { expiresIn: '1d' });

    return {
      token: jwt,
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      },
    };
  }
}
