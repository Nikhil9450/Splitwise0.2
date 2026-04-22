const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    action: {
        type: String,
        required: true
        // e.g. "ADD_EXPENSE", "REMOVE_MEMBER", "SETTLE_PAYMENT"
    },
    details: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = activitySchema;