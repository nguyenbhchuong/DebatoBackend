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
    if (!req.user) {
      console.log('No user data received from Google');
      return res.redirect('http://localhost:4200/login');
    }

    const { jwt } = req.user;

    if (jwt) {
      // Set JWT as HTTP-only cookie with proper options
      res.cookie('jwt', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      });

      console.log('JWT token set in cookie:', jwt);
      return res.redirect('http://localhost:4200/topic');
    } else {
      console.log('JWT token not found in user object:', req.user);
      return res.redirect('http://localhost:4200/login');
    }
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
    const user = req.user;
    return {
      authenticated: true,
      user: {
        id: user.sub,
        email: user.email,
        provider: user.provider || 'jwt',
      },
    };
  }
}
