const express = require("express");
const router = express.Router();

const Character = require("../models/Character");

// GET: Retrieve all characters
router.get("/", async (req, res) => {
    try {
        const characters = await Character.find();
        res.json(characters);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve characters"
        });
    }
});

// POST: Add a new character
router.post("/", async (req, res) => {
    try {
        const character = await Character.create(req.body);
        res.status(201).json(character);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create character",
            error: error.message
        });
    }
});

module.exports = router;