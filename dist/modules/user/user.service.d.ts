import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
export declare class UserService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    findById(id: number): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findByEmailAndGetPassword(email: string): Promise<User>;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User & UpdateUserDto>;
    deleteUser(id: number): Promise<User>;
}
