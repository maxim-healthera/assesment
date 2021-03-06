import { Application } from 'express';
import express from 'express';
import { Inject, Service } from 'typedi';
import chalk from 'chalk';
import compression from 'compression'
import ProjectsController from './controllers/projects.controller';
import UsersController from './controllers/users.controller';
import errorHandler from './lib/middlewares/errorHandler';
import TicketsController from './controllers/tickets.controller';

@Service()
export default class App {
  private readonly app: Application;

  @Inject('projects.controller')
  private projectsController: ProjectsController;

  @Inject('users.controller')
  private usersController: UsersController;

  @Inject('tickets.controller')
  private ticketsController: TicketsController;

  constructor() {
    this.app = express();
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(compression())
  }
  startServer() {
    const PORT = process.env.PORT;

    this.app.listen(PORT, () => {
      console.log(chalk.green(`server is running on port ${PORT}`));
    });
    return this;
  }
  initRoutes() {
    this.app.use('/api/projects', this.projectsController.router);
    this.app.use('/api/users', this.usersController.router);
    this.app.use('/api/tickets', this.ticketsController.router);
    this.app.use(errorHandler);
    return this;
  }
}
