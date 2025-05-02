import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';

export class TokenInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler<any>) {
    const res = ctx.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        if (data.accessToken && data.refreshToken) {
          res.cookie(process.env.ACCESS_TOKEN_COOKIE_NAME, data.accessToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            sameSite: 'none',
            maxAge: +process.env.JWT_EXPIRATION * 1000,
            path: '/',
          });

          res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, data.refreshToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            sameSite: 'none',
            maxAge: +process.env.REFRESH_TOKEN_EXPIRATION * 1000,
            path: '/',
          });

          delete data.refreshToken;
        }

        return data;
      }),
    );
  }
}
