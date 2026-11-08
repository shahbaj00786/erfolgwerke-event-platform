import { Router } from 'express';
import { createEvent, getAllEvents, getEventById, getMyEvents, updateEvent, deleteEvent } from '../controllers/eventController';
import { authUser } from '../middlewares/authUser';
import { authOrganizer } from '../middlewares/authOrganizer';

const eventRouter = Router();

eventRouter.get('/', getAllEvents);
eventRouter.post('/create', authUser, authOrganizer, createEvent);
eventRouter.get('/my-events', authUser, authOrganizer, getMyEvents);
eventRouter.put('/:id', authUser, authOrganizer, updateEvent);
eventRouter.delete('/:id', authUser, authOrganizer, deleteEvent);
eventRouter.get('/:id', getEventById);

export default eventRouter;