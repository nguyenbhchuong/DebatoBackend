import { Controller, Get, UseGuards, Res, Req, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
  @ApiResponse({ status: 200, description: 'Redirects to Google login page' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    console.log('ok');
    // initiates the Google OAuth2 login flow
  }

  @ApiOperation({ summary: 'Handle Google OAuth2 callback' })
  @ApiResponse({
    status: 200,
    description: 'Redirects with JWT token on success',
  })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    // handles the Google OAuth2 callback
    const jwt: string = req.user.jwt;
    if (jwt) res.redirect('http://localhost:4200/testSuccess?token=' + jwt);
    else res.redirect('http://localhost:4200/login/');
    //cookie logic here
    // res.cookie('jwt', jwt, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax' as const,
    //   expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    // });
    // return res.json({
    //   message: 'Login Successfully',
    //   user: {
    //     email: req.user.email,
    //     roles: req.user.roles,
    //   },
    // });
  }

  @ApiOperation({ summary: 'Access protected resource' })
  @ApiResponse({ status: 200, description: 'Returns protected data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protectedResource() {
    return 'JWT is working!';
  }

  @ApiOperation({ summary: 'Login with token' })
  @ApiResponse({ status: 200, description: 'Returns login confirmation' })
  @Post('login-token')
  async logintoken(@Req() req) {
    const token = this.authService.login(req.userID);
    return token;
  }

  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({ status: 200, description: 'User is authenticated' })
  @ApiResponse({ status: 401, description: 'User is not authenticated' })
  @Get('check-auth')
  @UseGuards(AuthGuard('jwt'))
  checkAuth(@Req() req) {
    return {
      authenticated: true,
      user: {
        id: req.user.sub,
        email: req.user.email,
      },
    };
  }
}
