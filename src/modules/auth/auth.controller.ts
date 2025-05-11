import { Body, Controller, Get, HttpCode, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { User } from '../../common/decorators';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenInterceptor } from './interceptors/token.interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @HttpCode(201)
  @Post('register')
  public async register(@Body() registerDto: CreateUserDto) {
    const user = await this.authService.register(registerDto);

    return user;
  }

  @UseInterceptors(TokenInterceptor)
  @Post('login')
  public async login(@Body() loginDto: LoginDto) {
    return await this.authService.validateLogin(loginDto);
  }

  @UseInterceptors(TokenInterceptor)
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  public async refresh(@User('id') userId: number) {
    return this.authService.refresh(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  public async me(@User() user) {
    return user;
  }

  @Post('logout')
  public async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.configService.getOrThrow('auth.accessTokenCookieName'), { path: '/' });
    res.clearCookie(this.configService.getOrThrow('auth.refreshTokenCookieName'), { path: '/' });

    return { message: 'Logout berhasil, sayonaraa' };
  }
}
