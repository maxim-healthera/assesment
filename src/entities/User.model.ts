import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ID } from '../types';
import { Project } from './Project.model';
import { Ticket } from './Ticket.model';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: ID;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Ticket, (ticket) => ticket.assignee)
  tickets: Ticket[];

  @ManyToMany(() => Project, (project) => project.users)
  @JoinTable({ name: 'projects_users' })
  projects: Project[];
}
