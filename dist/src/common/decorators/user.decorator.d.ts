import { DecodedJwtWithRefreshToken } from 'src/modules/auth/types/jwt';
export declare const User: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | keyof DecodedJwtWithRefreshToken)[]) => ParameterDecorator;
