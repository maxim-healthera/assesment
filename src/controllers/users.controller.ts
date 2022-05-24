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
  createUser(req: Request, res: Response, next: NextFunction) {
    const { lastName, firstName, email } = req.body;
    return this.userService.createUser({
      lastName,
      firstName,
      email,
    });
  }

  @Route()
  getSingleUserInfo(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    return this.userService.getSingleUserInfo(+userId);
  }

  @Route()
  getAllusers(req: Request, res: Response, next: NextFunction) {
    return this.userService.findAllUsers()
  }

  initRoutes(): void {
    this.router.post('/', this.createUser);
    this.router.get('/:userId', this.getSingleUserInfo);
    this.router.get('/', this.getAllusers);
  }
}
