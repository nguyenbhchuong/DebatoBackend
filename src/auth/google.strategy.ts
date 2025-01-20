
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { AuthService, Provider } from "./auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{
    
    constructor(
        private readonly authService: AuthService
    )
    {
        super({
            clientID    : JSON.parse(process.env.GOOGLE_CLIENT).web.client_id, // Not my real client secret, see your own application credentials at Google!
            clientSecret: JSON.parse(process.env.GOOGLE_CLIENT).web.client_secret, // Not my real client secret, see your own application credentials at Google!
            callbackURL : 'http://localhost:3000/auth/google/callback',
            passReqToCallback: true,
            scope: ['profile']
        })
    }


    async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function)
    {
        try
        {
            console.log(profile);

            const jwt: string = await this.authService.validateOAuthLogin(profile.id, Provider.GOOGLE);
            const user = 
            {
                jwt
            }

            done(null, user);
        }
        catch(err)
        {
            // console.log(err)
            done(err, false);
        }
    }
}