import { LoginDto } from './dtos/login.dto';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dtos/create-user.dto';
export declare class AuthService {
    private userService;
    private configService;
    private jwtService;
    constructor(userService: UserService, configService: ConfigService, jwtService: JwtService);
    register(registerDto: CreateUserDto): Promise<import("../user/entities/user.entity").User>;
    validateLogin(loginDto: LoginDto): Promise<{
        refreshToken: string;
        accessToken: string;
        user: import("../user/entities/user.entity").User;
    }>;
    refresh(userId: number): Promise<{
        user: import("../user/entities/user.entity").User;
        accessToken: string;
        refreshToken: string;
    }>;
    private generateAuthTokens;
}
