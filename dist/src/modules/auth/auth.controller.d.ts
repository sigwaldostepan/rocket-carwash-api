import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    register(registerDto: CreateUserDto): Promise<import("../user/entities/user.entity").User>;
    login(loginDto: LoginDto): Promise<{
        refreshToken: string;
        accessToken: string;
        user: import("../user/entities/user.entity").User;
    }>;
    refresh(userId: number): Promise<{
        user: import("../user/entities/user.entity").User;
        accessToken: string;
        refreshToken: string;
    }>;
    me(user: any): Promise<any>;
    logout(res: Response): Promise<{
        message: string;
    }>;
}
