import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRouter';
import eventRouter from './routes/eventRouter';
import rsvpRouter from './routes/rsvpRouter';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173" 
  ],
  credentials: true
}));

// Middlewares
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running...");
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);
app.use('/api/rsvps', rsvpRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});