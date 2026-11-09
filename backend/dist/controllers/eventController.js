"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getMyEvents = exports.getEventById = exports.getAllEvents = exports.createEvent = void 0;
const db_1 = __importDefault(require("../config/db"));
const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, venue, seatLimit } = req.body;
        const organizerId = req.user?.userId;
        if (!title || !description || !date || !time || !venue || !seatLimit) {
            res.json({ success: false, message: "All fields are required" });
            return;
        }
        const event = await db_1.default.event.create({
            data: {
                title,
                description,
                date,
                time,
                venue,
                seatLimit: Number(seatLimit),
                organizerId: organizerId,
            },
        });
        res.json({ success: true, message: "Event created successfully", event });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
};
exports.createEvent = createEvent;
const getAllEvents = async (_req, res) => {
    try {
        const events = await db_1.default.event.findMany({
            include: {
                organizer: { select: { id: true, name: true, email: true } },
                rsvps: true,
                _count: { select: { rsvps: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, events });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
};
exports.getAllEvents = getAllEvents;
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id || req.userId;
        const event = await db_1.default.event.findUnique({
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
        const isRegistered = userId
            ? event.rsvps.some((r) => String(r.userId) === String(userId))
            : false;
        res.json({ success: true, event: { ...event, isRegistered } });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
};
exports.getEventById = getEventById;
const getMyEvents = async (req, res) => {
    try {
        const organizerId = req.user?.userId;
        const events = await db_1.default.event.findMany({
            where: { organizerId: organizerId },
            include: {
                _count: { select: { rsvps: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, events });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
};
exports.getMyEvents = getMyEvents;
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, venue, seatLimit } = req.body;
        const organizerId = req.user?.userId;
        const event = await db_1.default.event.findUnique({ where: { id: Number(id) } });
        if (!event || event.organizerId !== organizerId) {
            res.json({ success: false, message: "Unauthorized or Event not found" });
            return;
        }
        const updatedEvent = await db_1.default.event.update({
            where: { id: Number(id) },
            data: {
                title: String(title),
                date: new Date(date).toISOString(),
                venue: String(venue),
                seatLimit: parseInt(String(seatLimit)) || 0
            }
        });
        res.json({ success: true, message: "Event updated successfully", event: updatedEvent });
    }
    catch (error) {
        console.error("Update Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};
exports.updateEvent = updateEvent;
// Delete Event
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const organizerId = req.user?.userId;
        const event = await db_1.default.event.findUnique({ where: { id: Number(id) } });
        if (!event || event.organizerId !== organizerId) {
            res.json({ success: false, message: "Unauthorized or Event not found" });
            return;
        }
        try {
            await db_1.default.rsvp.deleteMany({ where: { eventId: Number(id) } });
        }
        catch (e) {
            await db_1.default.rSVP.deleteMany({ where: { eventId: Number(id) } });
        }
        await db_1.default.event.delete({ where: { id: Number(id) } });
        res.json({ success: true, message: "Event deleted successfully" });
    }
    catch (error) {
        console.error("Delete Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};
exports.deleteEvent = deleteEvent;
