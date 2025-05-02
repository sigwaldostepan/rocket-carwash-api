import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtRefreshAuthStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      secretOrKey: configService.getOrThrow('jwt.refreshTokenSecret'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const refreshToken = req.cookies[configService.getOrThrow('auth.refreshTokenCookieName')];

          if (!refreshToken) {
            throw new UnauthorizedException();
          }

          return refreshToken;
        },
      ]),
    });
  }

  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}
