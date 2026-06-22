const mongoose = require("mongoose");

const personalExpenseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        description:{
            type:String,
            required:true,
        },
        amount:{
            type: Number,
            required:true,
        },
        date:{
            type: Date,
            default:Date.now
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("PersonalExpense",personalExpenseSchema)