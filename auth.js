
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER: Create a new account
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required."
            });
        }

        if (username.trim().length < 3) {
            return res.status(400).json({
                message: "Username must have at least 3 characters."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must have at least 8 characters."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim();

        // Prevent duplicate usernames or emails
        const existingUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { username: normalizedUsername }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "That username or email is already registered."
            });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword
        });

        res.status(201).json({
    message: "Void Walker account created successfully!",
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarId: user.avatarId || "void"
    }
});
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "That username or email is already registered."
            });
        }

        console.error("Registration error:", error.message);
        res.status(500).json({
            message: "Unable to register right now."
        });
    }
});

// LOGIN: Verify an existing account
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from .env");
            return res.status(500).json({
                message: "Authentication is not configured."
            });
        }

        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful!",
            token,
            user: {
    id: user._id,
    username: user.username,
    email: user.email,
    avatarId: user.avatarId || "void"
}
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({
            message: "Unable to log in right now."
        });
    }
});

module.exports = router;
