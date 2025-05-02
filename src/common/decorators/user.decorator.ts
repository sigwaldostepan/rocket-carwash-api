import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DecodedJwtWithRefreshToken } from 'src/modules/auth/types/jwt';

export const User = createParamDecorator(
  (data: keyof DecodedJwtWithRefreshToken | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (!data) {
      return req.user;
    }

    return req.user[data];
  },
);
