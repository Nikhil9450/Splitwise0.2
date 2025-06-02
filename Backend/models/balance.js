const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema({
    user1 : {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    user2 : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    amount:{
        type:Number,
        requried: true,
    },
    group:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Group"
    }
})