import { Router } from 'express';
import { createEvent, getAllEvents, getEventById } from '../controllers/eventController';
import { authUser } from '../middlewares/authUser';
import { authOrganizer } from '../middlewares/authOrganizer';

const eventRouter = Router();

eventRouter.get('/', getAllEvents);
eventRouter.get('/:id', getEventById);
eventRouter.post('/create', authUser, authOrganizer, createEvent);

export default eventRouter;