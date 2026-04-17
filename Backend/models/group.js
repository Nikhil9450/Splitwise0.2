const mongoose = require("mongoose");
const activitySchema = require("./activity");
const groupSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required:true,
        },
        members:[{
            type:mongoose.Schema.Types.ObjectId, 
            ref:"User"
        }],
        expenses:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Expense"
        }],
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        activities:[activitySchema]
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("Group",groupSchema);