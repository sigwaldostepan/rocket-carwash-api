import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expirationTime: +process.env.JWT_EXPIRATION,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpirationTime: +process.env.REFRESH_TOKEN_EXPIRATION,
}));
