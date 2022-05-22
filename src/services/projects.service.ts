import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AddUserToProjectDto, CreateProjectDto } from '../dto/projects.dto';
import { Project } from '../entities/Project.model';
import { User } from '../entities/User.model';
import ProjectsRepository from '../repositories/projects.repository';
import UserRepository from '../repositories/users.repository';
import {
  CreateSuccessResponse,
  EntitySelectFields,
  FindOneCustomOptions,
  ID,
} from '../types';
import UserService from './users.service';

@Service()
class ProjectService {
  constructor(
    @InjectRepository(Project) private projectsRepository: ProjectsRepository,
    @InjectRepository(User) private usersRepository: UserRepository,
    private readonly usersService: UserService
  ) {}

  getAllProjects() {
    return this.projectsRepository.find({
      select: ['description', 'title'],
    });
  }

  getSingleProjectInfo(
    id: ID,
    options: FindOneCustomOptions<Project> = {}
  ): Promise<Project> {
    return this.projectsRepository.findOne(id, options);
  }

  async createProject(body: CreateProjectDto): Promise<CreateSuccessResponse> {
    const newProject = await this.projectsRepository.insert(body);
    return { id: newProject.identifiers[0].id, success: true };
  }

  async addUserToProject(body: AddUserToProjectDto): Promise<string> {
    const { projectId, userId } = body;
    const projectFromDb = await this.getSingleProjectInfo(projectId, {
      relations: ['users'],
      select: ['id', 'title'],
    });
    if (!projectFromDb) {
      throw new Error('No Such Project');
    }

    if (projectFromDb.users.some((user) => user.id === userId)) {
      throw new Error(
        `this user is already participating on ${projectFromDb.title}`
      );
    }
    const userFromDb = await this.usersService.getSingleUserInfo(userId, {
      select: ['id', 'firstName', 'lastName'],
    });
    if (!userFromDb) {
      throw new Error('No Such User');
    }
    projectFromDb.users.push(userFromDb);
    await this.projectsRepository.save(projectFromDb);
    return `user ${userFromDb.firstName} ${userFromDb.lastName} added to ${projectFromDb.title}`;
  }
}
export default ProjectService;
