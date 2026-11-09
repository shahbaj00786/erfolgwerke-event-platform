"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const eventRouter_1 = __importDefault(require("./routes/eventRouter"));
const rsvpRouter_1 = __importDefault(require("./routes/rsvpRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173"
    ],
    credentials: true
}));
// Middlewares
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Backend running...");
});
// Routes
app.use('/api/auth', authRouter_1.default);
app.use('/api/events', eventRouter_1.default);
app.use('/api/rsvps', rsvpRouter_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
