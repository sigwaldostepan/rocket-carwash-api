import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { UserService } from '../user/user.service';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt';
import { CreateUserDto } from '../user/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  public async register(registerDto: CreateUserDto) {
    return await this.userService.createUser(registerDto);
  }

  public async validateLogin(loginDto: LoginDto) {
    const user = await this.userService.findByEmailAndGetPassword(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Email atau password invalid');
    }

    const passwordValid = await verify(user.password, loginDto.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Email atau password invalid');
    }

    const { accessToken, refreshToken } = await this.generateAuthTokens({
      sub: user.id,
      name: user.name,
      email: user.email,
    });

    delete user.password;

    return {
      refreshToken: refreshToken,
      accessToken,
      user,
    };
  }

  public async refresh(userId: number) {
    const user = await this.userService.findById(+userId);

    const { accessToken, refreshToken } = await this.generateAuthTokens({
      email: user.name,
      name: user.name,
      sub: user.id,
    });

    return { user, accessToken, refreshToken };
  }

  private async generateAuthTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.configService.getOrThrow('jwt.secret'),
          expiresIn: this.configService.getOrThrow('jwt.expirationTime'),
        },
      ),
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.configService.getOrThrow('jwt.refreshTokenSecret'),
          expiresIn: this.configService.getOrThrow('jwt.refreshTokenExpirationTime'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
