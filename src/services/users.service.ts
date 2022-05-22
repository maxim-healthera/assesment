import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CreateUserDto } from '../dto/users.dto';
import { User } from '../entities/User.model';
import UserRepository from '../repositories/users.repository';

@Service()
class UserService {
  constructor(@InjectRepository(User) private userRepository: UserRepository) {}

//   async deleteUser(id: string) {
//     const data = await this.userRepository.delete(id);
//     if (!data?.affected) {
//       throw new Error('Error while deleting user');
//     }
//     return data;
//   }

  //   async getEventsOfSingleUser(id: number) {
  //     const user = await this.userRepository.findOne(id, {
  //       relations: ["events"],
  //     });
  //     if (!user) {
  //       throw new CustomError(HttpStatusCode.NOT_FOUND, "User not found");
  //     }
  //     return user.events;
  //   }

//   findAllUsers() {
//     return this.userRepository.find({
//       select: ['id', 'firstName', 'lastName', 'email'],
//     });
//   }

  async createUser(body: CreateUserDto) {
    const newUser = await this.userRepository.insert(body);
    return newUser;
  }
}
export default UserService;
