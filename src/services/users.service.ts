import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CreateUserDto } from '../dto/users.dto';
import { Ticket } from '../entities/Ticket.model';
import { User } from '../entities/User.model';
import UserRepository from '../repositories/users.repository';
import { FindOneCustomOptions, ID } from '../types';
import redisService from './redis.service';


@Service()
class UserService {
  private redisService: any
  constructor(
    @InjectRepository(User) private userRepository: UserRepository,
  ) {
    this.redisService = redisService
  }

  async getSingleUserInfo(
    id: ID,
    options: FindOneCustomOptions<User> = {}
  ): Promise<User> {
    const user = await this.userRepository.findOne(id, options);
    return user;
  }

  async findAllUsers() {
    await this.redisService.set('hello', 'world');
    return this.userRepository.find({
      select: ['id', 'firstName', 'lastName', 'email'],
    });
  }

  async createUser(body: CreateUserDto) {
    const newUser = await this.userRepository.insert(body);
    return newUser;
  }

  attachTicketToUser(user: User, ticket: Ticket): Promise<User> {
    user.tickets.push(ticket);
    return this.userRepository.save(user);
  }
}
export default UserService;
