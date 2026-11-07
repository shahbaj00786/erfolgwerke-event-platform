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

export const getMyEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const organizerId = req.user?.userId;

    const events = await prisma.event.findMany({
      where: { organizerId: organizerId },
      include: {
        _count: { select: { rsvps: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, events });
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, date, venue, seatLimit } = req.body;
    const organizerId = req.user?.userId;

    const event = await prisma.event.findUnique({ where: { id: Number(id) } });
    if (!event || event.organizerId !== organizerId) {
      res.json({ success: false, message: "Unauthorized or Event not found" });
      return;
    }

    // Data ko Prisma ke hisaab se sahi format mein convert kar rahe hain
    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title: String(title),
        date: new Date(date).toISOString(), // Date ko safe ISO string mein badla
        venue: String(venue),
        seatLimit: parseInt(String(seatLimit)) || 0 // Number ko safe Integer mein badla
      }
    });

    res.json({ success: true, message: "Event updated successfully", event: updatedEvent });
  } catch (error: any) {
    console.error("Update Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Delete Event
export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const organizerId = req.user?.userId;

    const event = await prisma.event.findUnique({ where: { id: Number(id) } });
    if (!event || event.organizerId !== organizerId) {
      res.json({ success: false, message: "Unauthorized or Event not found" });
      return;
    }

    // Yahan agar aapka model Rsvp hai, toh prisma.rsvp likhna hoga (chote aksharon mein)
    // Agar RSVP hai toh prisma.rSVP. Pehle 'rsvp' try karte hain:
    try {
      await (prisma as any).rsvp.deleteMany({ where: { eventId: Number(id) } });
    } catch (e) {
      // Agar rsvp nahi chala, toh rSVP try karega
      await (prisma as any).rSVP.deleteMany({ where: { eventId: Number(id) } });
    }
    
    // Phir main event delete karein
    await prisma.event.delete({ where: { id: Number(id) } });

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error: any) {
    console.error("Delete Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};