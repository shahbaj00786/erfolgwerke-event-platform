"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOrganizer = void 0;
const authOrganizer = (req, res, next) => {
    if (req.user && (req.user.role === 'organizer' || req.user.role === 'ORGANIZER')) {
        next();
    }
    else {
        res.json({ success: false, message: 'Access denied. Organizer only route.' });
    }
};
exports.authOrganizer = authOrganizer;
