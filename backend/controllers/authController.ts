import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

// Signup Controller
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.json({ success: false, message: "All fields are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.json({ success: false, message: "User already exists with this email" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, // 'organizer' ya 'attendee'
      },
    });

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: "Signup successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};

// Login Controller
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.json({ success: false, message: "Email and password are required" });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.json({ success: false, message: "Invalid email or password" });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.json({ success: false, message: "Invalid email or password" });
      return;
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};