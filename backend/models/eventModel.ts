export interface IEvent {
  id?: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  seatLimit: number;
  organizerId: number;
  createdAt?: Date;
}

export interface IRSVP {
  id?: number;
  userId: number;
  eventId: number;
  createdAt?: Date;
}