
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/authmiddleware");

const allowedAvatars = [
  "void",
  "harris",
  "harlina",
  "zero",
  "shadow",
  "galaxy"
];

// GET: Load the logged-in user's profile
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("username email avatarId createdAt");

    if (!user) {
      return res.status(404).json({
        message: "User account not found."
      });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Profile loading error:", error);

    return res.status(500).json({
      message: "Unable to load your profile."
    });
  }
});

// PATCH: Save the selected avatar
router.patch("/avatar", authMiddleware, async (req, res) => {
  try {
    const { avatarId } = req.body;

    if (!allowedAvatars.includes(avatarId)) {
      return res.status(400).json({
        message: "Please select a valid Void Walker avatar."
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatarId },
      {
        new: true,
        runValidators: true
      }
    ).select("username email avatarId createdAt");

    if (!user) {
      return res.status(404).json({
        message: "User account not found."
      });
    }

    return res.json({
      message: "Void Walker avatar updated!",
      user
    });
  } catch (error) {
    console.error("Avatar update error:", error);

    return res.status(500).json({
      message: "Unable to update your avatar."
    });
  }
});

module.exports = router;
