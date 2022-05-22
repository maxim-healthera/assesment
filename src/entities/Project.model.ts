import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { ID } from '../types';
import { Ticket } from './Ticket.model';
import { User } from './User.model';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  id: ID;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.projects)
  users: User[];

  @OneToMany(() => Ticket, (ticket) => ticket.project)
  tickets: Ticket[];
}
