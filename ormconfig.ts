import { Project } from './src/entities/Project.model';
import { Ticket } from './src/entities/Ticket.model';
import { User } from './src/entities/User.model';

const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [User, Project, Ticket],
  synchronize: true,
  logging: false,
  database: process.env.DB_NAME,
};
export = config;
