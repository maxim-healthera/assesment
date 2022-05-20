import { NextFunction, Router, Request, Response } from 'express';
import { Service } from 'typedi';
import BaseController from '../types/BaseController';

@Service('projects.controller')
export default class ProjectsController extends BaseController {
  public router: Router;
  constructor() {
    super();
    this.router = Router();
    this.initRoutes();
  }

  createProject(req: Request, res: Response, next: NextFunction) {}
  initRoutes(): void {
    this.router.post('/', this.createProject);
  }
}
