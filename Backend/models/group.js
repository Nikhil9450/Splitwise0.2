const mongoose = requrie("mongoose");

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
    },
    {
        timeStamps:true
    }
);

mongoose.exports = mongoose.model("Group",groupSchema);