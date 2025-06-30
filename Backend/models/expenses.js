const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        description:{
            type:String,
            required:true,
        },
        amount:{
            type: Number,
            required:true,
        },
        paidBy:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:"User",
            required:true,
        },
        addedBy:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:"User",
            required:true,
        },
        splitBetweenWithAmt: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            amount: { type: Number, required: true },
            owesTo:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        }],
        group:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Group"
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

module.exports = mongoose.model("Expense",expenseSchema)