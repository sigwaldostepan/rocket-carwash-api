import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  public async findById(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User gak ketemu');
    }

    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    return user;
  }

  public async findByEmailAndGetPassword(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'password'],
    });

    return user;
  }

  public async createUser(createUserDto: CreateUserDto) {
    const emailUsed = await this.findByEmail(createUserDto.email);

    if (emailUsed) {
      throw new ConflictException('Email udh kepake');
    }

    const user = this.userRepo.create({ ...createUserDto });

    await this.userRepo.save(user);

    delete user.password;

    return user;
  }

  public async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.findById(userId);

    if (updateUserDto.email) {
      const isEmailExist = await this.findByEmail(updateUserDto.email);

      const isConflict = isEmailExist && isEmailExist.email !== user.email;

      if (isConflict) {
        throw new ConflictException('Email udh kepake');
      }
    }

    const editedUser = Object.assign(user, updateUserDto);

    return await this.userRepo.save(editedUser);
  }

  public async deleteUser(id: number) {
    const user = await this.findById(id);

    return await this.userRepo.remove(user);
  }
}
