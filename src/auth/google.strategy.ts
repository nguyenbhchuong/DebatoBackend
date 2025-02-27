import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService, Provider } from './services/auth.service';
import { UsersService } from './services/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: JSON.parse(process.env.GOOGLE_CLIENT).web.client_id, // Not my real client secret, see your own application credentials at Google!
      clientSecret: JSON.parse(process.env.GOOGLE_CLIENT).web.client_secret, // Not my real client secret, see your own application credentials at Google!
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile,
    done: Function,
  ) {
    try {
      // Check if user exists
      let user = await this.usersService.findByGoogleId(profile.id);

      if (!user) {
        // Check if email is already registered
        user = await this.usersService.findOne(profile.emails[0].value);

        if (user) {
          // Link Google account to existing user
          user = await this.usersService.linkGoogleAccount(
            user._id.toString(),
            profile.id,
          );
        } else {
          // Create new user
          user = await this.usersService.createGoogleUser({
            email: profile.emails[0].value,
            googleId: profile.id,
            displayName: profile.displayName,
            isEmailVerified: profile.emails[0].verified || false,
          });
        }
      }

      const { token: jwt, cookieOptions } = await this.authService.login(
        user._id.toString(),
        user.email,
        'google',
      );

      done(null, {
        jwt,
        user: {
          id: user._id,
          email: user.email,
          roles: user.roles,
          provider: 'google',
        },
      });
    } catch (err) {
      // console.log(err)
      done(err, false);
    }
  }
}
