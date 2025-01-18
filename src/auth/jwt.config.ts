import { registerAs } from "@nestjs/config";
import {JwtModuleOptions} from "@nestjs/jwt";

export default registerAs(
    "jwt", 
    (): JwtModuleOptions => ({
    secret: "THISISAVERYSERIOUSANDSECRETKEY@BAICO1212144422221",
    signOptions: {
        expiresIn: "1d",
    }
}))