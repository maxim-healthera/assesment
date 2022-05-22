import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ID } from '../types';
import { Project } from './Project.model';
import { User } from './User.model';

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn()
  id: ID;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  storyPoints: number;

  @ManyToOne(() => User, (user) => user.tickets)
  assignee: User;

//   @Column({ nullable: false })
  @ManyToOne(() => Project, (project) => project.tickets)
  project: Project;
}
