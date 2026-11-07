import { Response } from 'express';
import { AuthRequest } from '../middlewares/authUser';
import prisma from '../config/db';

export const createRsvp = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.body;
    const userId = req.user?.userId;

    if (!eventId) {
      res.json({ success: false, message: "Event ID is required" });
      return;
    }

    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) },
      include: { _count: { select: { rsvps: true } } }
    });

    if (!event) {
      res.json({ success: false, message: "Event not found" });
      return;
    }

    if (event._count.rsvps >= event.seatLimit) {
      res.json({ success: false, message: "Seat limit reached for this event" });
      return;
    }

    const existingRsvp = await prisma.rsvp.findFirst({
      where: { userId: userId!, eventId: Number(eventId) }
    });

    if (existingRsvp) {
      res.json({ success: false, message: "You have already registered for this event" });
      return;
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        userId: userId!,
        eventId: Number(eventId),
      },
    });

    res.json({ success: true, message: "RSVP successful", rsvp });
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};

export const getUserRsvps = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const rsvps = await prisma.rsvp.findMany({
      where: { userId: userId! },
      include: {
        event: {
          include: { organizer: { select: { id: true, name: true, email: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, rsvps });
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};