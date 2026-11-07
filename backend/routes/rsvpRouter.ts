import { Router } from 'express';
import { createRsvp, getUserRsvps } from '../controllers/rsvpController';
import { authUser } from '../middlewares/authUser';

const rsvpRouter = Router();

rsvpRouter.post('/create', authUser, createRsvp);
rsvpRouter.get('/my-rsvps', authUser, getUserRsvps);

export default rsvpRouter;