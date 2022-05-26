import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { QueueActions } from '../constants';
import { CreateTicketDto } from '../dto/tickets.dto';
import { Ticket } from '../entities/Ticket.model';
import TicketsRepository from '../repositories/tickets.repository';
import { CreateSuccessResponse, EntitySelectFields, ID } from '../types';
import ProjectService from './projects.service';
import queueService from './queue.service';
import UserService from './users.service';

@Service()
class TicketsService {
  private readonly queueService;
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: TicketsRepository,
    private readonly projectsService: ProjectService,
    private readonly usersService: UserService
  ) {
    this.queueService = queueService;
  }

  getSingleTicketInfo(
    id: ID,
    selectFields?: EntitySelectFields<Ticket>
  ): Promise<Ticket> {
    return this.ticketsRepository.findOne(id, {
      ...(selectFields ? { select: selectFields } : {}),
    });
  }

  async createTicket(body: CreateTicketDto): Promise<CreateSuccessResponse> {
    const { projectId, storyPoints, title, description, userId } = body;
    const projectFromDb = await this.projectsService.getSingleProjectInfo(
      projectId
    );
    if (!projectFromDb) {
      throw new Error('No Such Project!!!');
    }
    const userFromDb = userId
      ? await this.usersService.getSingleUserInfo(userId, {
          relations: ['projects'],
        })
      : null;
    if (userId && !userFromDb) {
      throw new Error('No Such User!!!');
    }
    if (
      userFromDb &&
      !userFromDb.projects.some((project) => project.id === projectId)
    ) {
      throw new Error(
        `this user doesn\'t participate on ${projectFromDb.title}`
      );
    }

    const newTicket = await this.ticketsRepository.insert({
      storyPoints,
      title,
      description,
      project: projectFromDb,
      assignee: userFromDb,
    });

    const newTicketId = newTicket.identifiers[0].id;

    if (userFromDb) {
      this.queueService.sendToQueue(QueueActions.TICKET_ASSIGNED, {
        ticketId: newTicketId,
        ticketTitle: title,
        userEmail: userFromDb.email,
        userFullName: `${userFromDb.firstName} ${userFromDb.lastName}`,
      });
    }

    return { id: newTicketId, success: true };
  }
}
export default TicketsService;
