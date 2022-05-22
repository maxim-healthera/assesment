import { EntityRepository, Repository } from "typeorm";
import { Ticket } from "../entities/Ticket.model";

@EntityRepository(Ticket)
export default class TicketsRepository extends Repository<Ticket> {}
