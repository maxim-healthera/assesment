import { ID } from '../types';

export abstract class CreateTicketDto {
  title: string;
  description?: string;
  storyPoints?: number;
  projectId: ID;
  userId?: ID;
}

export abstract class AssignTicketDto {
  ticketId: ID;
  userId: ID;
}
