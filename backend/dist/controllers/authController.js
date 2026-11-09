"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
// Signup Controller
const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            res.json({ success: false, message: "All fields are required" });
            return;
        }
        // Check if user already exists
        const existingUser = await db_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.json({ success: false, message: "User already exists with this email" });
            return;
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create user
        const user = await db_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });
        // Generate JWT Token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
        res.json({
            success: true,
            message: "Signup successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
};
exports.signup = signup;
// Login Controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.json({ success: false, message: "Email and password are required" });
            return;
        }
        // Find user
        const user = await db_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res.json({ success: false, message: "Invalid email or password" });
            return;
        }
        // Check password
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.json({ success: false, message: "Invalid email or password" });
            return;
        }
        // Generate JWT Token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
        res.json({
            success: true,
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
};
exports.login = login;
