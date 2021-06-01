import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new HttpException(
        'Email already registred',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = this.usersRepository.create(createUserDto);
    await newUser.save();

    delete newUser.password;
    return newUser;
  }

  async findAll(searchUserDto: SearchUserDto): Promise<any> {
    return searchUserDto.limit;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    delete user.password;
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email: email });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    delete user.password;

    await this.usersRepository.update(user.id, updateUserDto).catch((error) => {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    });

    return Object.assign(user, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
