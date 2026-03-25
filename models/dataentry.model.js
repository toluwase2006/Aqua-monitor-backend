const mongoose = require("mongoose");

const dataEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    year: {
        type: Number,
        required: true,
    },

    month: {
        type: String,
        required: true, // e.g. "March"
    },

    fishStock: {
        totalFish: {
            type: Number,
            default: 0,
        },
        fishLost: {
            type: Number,
            default: 0,
        },
        lossCause: {
            type: String,
        },
    },

    finance: {
        revenue: {
            type: Number,
            default: 0,
        },
        expenses: {
            type: Number,
            default: 0,
        },
    },

    foodUsage: {
        totalFoodUsed: {
            type: Number,
            default: 0,
        },
        totalFoodCost: {
            type: Number,
            default: 0,
        }
    },

    // Reference to User (seller or agent)
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },


}, { timestamps: true });

module.exports = mongoose.model("DataEntry", dataEntrySchema);