import { ID } from '../types';

export abstract class CreateProjectDto {
  title: string;
  description?: string;
}

export abstract class AddUserToProjectDto {
  userId: ID;
  projectId: ID;
}
