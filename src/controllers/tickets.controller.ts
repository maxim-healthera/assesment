import { NextFunction, Router, Request, Response } from 'express';
import { Service } from 'typedi';
import Route from '../lib/decorators/Route';
import ProjectService from '../services/projects.service';
import TicketsService from '../services/tickets.service';
import BaseController from '../types/BaseController';

@Service('tickets.controller')
export default class TicketsController extends BaseController {
  public router: Router;
  constructor(private readonly ticketsService: TicketsService) {
    super();
    this.router = Router();
    this.initRoutes();
  }

  @Route()
  createTicket(req: Request) {
    const { title, description, projectId, storyPoints, userId } = req.body;
    return this.ticketsService.createTicket({
      title,
      description,
      projectId,
      storyPoints,
      userId,
    });
  }

  initRoutes(): void {
    this.router.post('/', this.createTicket);
  }
}
