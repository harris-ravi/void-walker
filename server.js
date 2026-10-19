const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");

const profileRoutes = require("./routes/profile");

const characterRoutes = require("./routes/characters");

const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/characters", characterRoutes);
// Test route
app.get("/", (req, res) => {
    res.send("🔥 Void Walker Universe Backend is alive! 💜");
});

app.get("/api/status", (req, res) => {
    res.json({
        project: "Void Walker Universe",
        backend: "Online",
        database: mongoose.connection.readyState === 1
            ? "Connected"
            : "Disconnected"
    });
});
// Connect to MongoDB, then start the server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(
                `🚀 Void Walker backend running at http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);
    });