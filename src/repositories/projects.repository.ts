import { EntityRepository, Repository } from "typeorm";
import { Project } from "../entities/Project.model";

@EntityRepository(Project)
export default class ProjectsRepository extends Repository<Project> {}
