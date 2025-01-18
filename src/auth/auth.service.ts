import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtModule} from '@nestjs/jwt';
import { sign } from 'jsonwebtoken';
import { AuthPayload } from './auth.payload';

export enum Provider
{
    GOOGLE = 'google'
}

@Injectable()
export class AuthService {
    
    private readonly JWT_SECRET_KEY = process.env.JWT_KEY; // <- replace this with your secret key

    constructor() {};

    async validateOAuthLogin(thirdPartyId: string, provider: Provider): Promise<string>
    {
        try 
        {
            // You can add some registration logic here, 
            // to register the user using their thirdPartyId (in this case their googleId)
            // let user: IUser = await this.usersService.findOneByThirdPartyId(thirdPartyId, provider);
            
            // if (!user)
                // user = await this.usersService.registerOAuthUser(thirdPartyId, provider);
                
            const payload = {
                thirdPartyId,
                provider
            }

            const jwt: string = sign(payload, this.JWT_SECRET_KEY, { expiresIn: 3600 });
            return jwt;
        }
        catch (err)
        {
            throw new InternalServerErrorException('validateOAuthLogin', err.message);
        }
    }

    login(userID: string){
        const payload: AuthPayload = {sub: userID};
        // console.log('this is userID: ' + userID);
        // console.log('this is JWT key: ' + this.JWT_SECRET_KEY);
        // console.log('string merge: ' + userID + this.JWT_SECRET_KEY);
        const jwt: string = sign(payload, this.JWT_SECRET_KEY, { expiresIn: 3600 });
        return jwt;
    }
}