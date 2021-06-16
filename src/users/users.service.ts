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

  async findAll(searchUserDto: SearchUserDto): Promise<User[]> {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.biography',
        'user.area',
        'user.photo',
      ]);

    if (searchUserDto.name) {
      query.andWhere('LOWER(user.name) ILIKE LOWER(:name)', {
        name: `%${searchUserDto.name}%`,
      });
    }

    if (searchUserDto.area) {
      query.andWhere('user.area = :area', {
        area: searchUserDto.area,
      });
    }

    if (searchUserDto.programmingLanguage) {
      query.andWhere(':programmingLanguages = ANY(user.programmingLanguages)', {
        programmingLanguages: searchUserDto.programmingLanguage,
      });
    }

    if (searchUserDto.softwares) {
      query.andWhere(':softwares = ANY(user.softwares)', {
        softwares: searchUserDto.softwares,
      });
    }

    const users = await query.getMany();

    return users;
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

  async upload(id: number, file: Express.Multer.File) {
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    delete user.password;

    let filePath = file.path;
    filePath = filePath.replace(/uploads\\/, '');

    await this.usersRepository
      .update(user.id, { photo: filePath })
      .catch((error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });

    return Object.assign(user, { photo: filePath });
  }
}
