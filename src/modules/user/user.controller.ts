import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @Get(':id')
  public async findUser(@Param('id', new ParseIntPipe()) userId: number) {
    const user = await this.userService.findById(userId);

    return user;
  }

  @HttpCode(200)
  @Put(':id')
  public async updateUser(@Param('id', new ParseIntPipe()) userId: number, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.updateUser(userId, updateUserDto);

    return updatedUser;
  }

  @HttpCode(204)
  @Delete(':id')
  public async deleteUser(@Param('id', new ParseIntPipe()) userId: number) {
    return await this.userService.deleteUser(userId);
  }
}
