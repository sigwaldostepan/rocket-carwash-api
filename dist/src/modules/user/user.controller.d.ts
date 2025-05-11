import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    findUser(userId: number): Promise<import("./entities/user.entity").User>;
    updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User & UpdateUserDto>;
    deleteUser(userId: number): Promise<import("./entities/user.entity").User>;
}
