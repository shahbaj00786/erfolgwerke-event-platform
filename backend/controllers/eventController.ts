import { Response } from 'express';
import { AuthRequest } from '../middlewares/authUser';
import prisma from '../config/db';

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, date, time, venue, seatLimit } = req.body;
    const organizerId = req.user?.userId;

    if (!title || !description || !date || !time || !venue || !seatLimit) {
      res.json({ success: false, message: "All fields are required" });
      return;
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date,
        time,
        venue,
        seatLimit: Number(seatLimit),
        organizerId: organizerId!,
      },
    });

    res.json({ success: true, message: "Event created successfully", event });
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllEvents = async (_req: any, res: Response): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        _count: { select: { rsvps: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, events });
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};

export const getEventById = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        rsvps: { include: { user: { select: { id: true, name: true, email: true } } } }
      }
    });

    if (!event) {
      res.json({ success: false, message: "Event not found" });
      return;
    }

    res.json({ success: true, event });
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};