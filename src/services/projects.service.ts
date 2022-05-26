import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AddUserToProjectDto, CreateProjectDto } from '../dto/projects.dto';
import { Project } from '../entities/Project.model';
import ProjectsRepository from '../repositories/projects.repository';
import { CreateSuccessResponse, FindOneCustomOptions, ID } from '../types';
import queueService from './queue.service';
import redisService from './redis.service';
import UserService from './users.service';

@Service()
class ProjectService {
  private redisService;
  private queueService;
  constructor(
    @InjectRepository(Project) private projectsRepository: ProjectsRepository,
    private readonly usersService: UserService
  ) {
    this.redisService = redisService;
    this.queueService = queueService;
  }

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

  async getProjectStats(projectId: ID): Promise<Project> {
    const key = `project-stats-${projectId}`;
    return this.redisService.get(key, () =>
      this.getSingleProjectInfo(projectId, {
        relations: ['users', 'tickets'],
        select: ['id'],
      })
    );
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

    this.queueService.sendToQueue('userAddedToProjectEmail', {
      userFullName: `${userFromDb.firstName} ${userFromDb.lastName}`,
      projectTitle: projectFromDb.title,
      userEmail: userFromDb.email,
    });
    return `user ${userFromDb.firstName} ${userFromDb.lastName} added to ${projectFromDb.title}`;
  }
}
export default ProjectService;
