import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
export declare class LoggerInterceptor implements NestInterceptor {
    intercept(ctx: ExecutionContext, next: CallHandler<any>): import("rxjs").Observable<any>;
}
