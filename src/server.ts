import { Application } from 'express';
import express from 'express';
import { join } from 'path';
import { Inject, Service } from 'typedi';
import chalk from 'chalk';
import ProjectsController from './controllers/projects.controller';

@Service()
export default class App {
  private readonly app: Application;

  @Inject('projects.controller')
  private projectsController: ProjectsController;

  constructor() {
    this.app = express();
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }
  startServer() {
    const PORT = process.env.PORT || 4000;
    console.log(PORT)
    this.app.listen(PORT, () => {
      console.log(chalk.green(`server is running on port ${PORT}`));
    });
    return this;
  }
  initRoutes() {
    this.app.use('/api/projects', this.projectsController.router);
    // this.app.use("/api/users", this.userController.router);
    // this.app.use("/api/sub", this.subscriptionController.router);
    // this.app.use("/api/auth", this.authController.router);
    // this.app.use("/api/roles", this.roleController.router);
    // this.app.use("/api/perm", this.permissionController.router);
    // this.app.use("/api/category", this.categoryController.router);
    // this.app.use("/api/file", this.fileController.router);
    // this.app.use(errorHandler);
    return this;
  }
}
