import { Response, NextFunction } from 'express';
import { AuthRequest } from './authUser';

export const authOrganizer = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'organizer') {
    next();
  } else {
    res.json({ success: false, message: 'Access denied. Organizer only route.' });
  }
};