import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  accessTokenCookieName: process.env.ACCESS_TOKEN_COOKIE_NAME,
  refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME,
}));
