import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';

export class LoggerInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler<any>) {
    const req = ctx.switchToHttp().getRequest();
    const now = Date.now();

    console.log(`[Request] ${req.method} ${req.url}`);

    return next.handle().pipe(
      tap((data) => {
        console.log(`[Response] ${req.method} ${req.url} - ${Date.now() - now}ms`);
        console.log(`Response Data:`, data);
      }),
    );
  }
}
