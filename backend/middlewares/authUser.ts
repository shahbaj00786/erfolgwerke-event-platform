import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const authUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.json({ success: false, message: 'Not authorized, token missing' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as { userId: number; role: string };
    
    req.user = decoded;
    next();
  } catch (error) {
    res.json({ success: false, message: 'Invalid or expired token' });
  }
};