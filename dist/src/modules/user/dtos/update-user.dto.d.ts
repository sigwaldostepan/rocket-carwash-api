import { CreateUserDto } from './create-user.dto';
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Pick<CreateUserDto, "name" | "email">>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export {};
