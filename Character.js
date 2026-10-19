const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    role: {
        type: String,
        required: true
    },

    power: {
        type: String,
        default: "Unknown"
    }
});

module.exports = mongoose.model("Character", characterSchema);