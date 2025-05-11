import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt';
declare const JwtRefreshAuthStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshAuthStrategy extends JwtRefreshAuthStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): {
        id: number;
        email: string;
        name: string;
    };
}
export {};
