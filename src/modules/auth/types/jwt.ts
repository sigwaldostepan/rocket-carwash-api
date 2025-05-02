export interface JwtPayload {
  sub: number;
  email: string;
  name: string;
}

export interface DecodedJwt {
  id: number;
  email: number;
  name: number;
}

export interface DecodedJwtWithRefreshToken extends DecodedJwt {
  refreshToken: string;
}
