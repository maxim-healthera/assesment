import { NextFunction, Router, Request, Response } from 'express';
import { Service } from 'typedi';
import { Project } from '../entities/Project.model';
import Route from '../lib/decorators/Route';
import ProjectService from '../services/projects.service';
import { CreateSuccessResponse } from '../types';
import BaseController from '../types/BaseController';

@Service('projects.controller')
export default class ProjectsController extends BaseController {
  public router: Router;
  constructor(private readonly projectsService: ProjectService) {
    super();
    this.router = Router();
    this.initRoutes();
  }

  @Route()
  createProject(req: Request): Promise<CreateSuccessResponse> {
    const { title, description } = req.body;
    return this.projectsService.createProject({ title, description });
  }

  @Route()
  getSingleProjectInfo(req: Request): Promise<Project> {
    const { projectId } = req.params;
    return this.projectsService.getSingleProjectInfo(+projectId);
  }

  @Route()
  addUserToProject(req: Request): Promise<string> {
    const { projectId } = req.params;
    const { userId } = req.body;
    return this.projectsService.addUserToProject({
      projectId: +projectId,
      userId,
    });
  }

  initRoutes(): void {
    this.router.post('/', this.createProject);
    this.router.get('/:projectId', this.getSingleProjectInfo);
    this.router.put('/:projectId/users', this.addUserToProject);
  }
}
