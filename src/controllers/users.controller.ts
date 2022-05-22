import { NextFunction, Router, Request, Response } from 'express';
import { Service } from 'typedi';
import Route from '../lib/decorators/Route';
import UserService from '../services/users.service';
import BaseController from '../types/BaseController';

@Service('users.controller')
export default class UsersController extends BaseController {
  public router: Router;
  constructor(private userService: UserService) {
    super();
    this.router = Router();
    this.initRoutes();
  }

  @Route()
  async createUser(req: Request, res: Response, next: NextFunction) {
    const { lastName, firstName, email } = req.body;
    const data = await this.userService.createUser({
      lastName,
      firstName,
      email,
    });
    return data;
  }

  initRoutes(): void {
    this.router.post('/', this.createUser);
  }
}
