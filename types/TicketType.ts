import { User } from "./UserType";

export default interface TicketType {
    title: string;
    ticket_id: string;
    description: string;
    created_at: string;
    agent?: User;
    reporter?: User;
  }