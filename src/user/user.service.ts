import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './entities/user.entity';
import { convertStringToObjectId } from 'src/shared/entityUtils';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return (
      (await this.userRepository.findOneBy({
        email,
      })) || null
    );
  }

  async delete(uid: string): Promise<void> {
    const id = convertStringToObjectId(uid);
    const result = await this.userRepository.delete({ id });
    if (!result.affected) {
      throw new NotFoundException(`No user with ID "${uid}" was found`);
    }
  }
}
