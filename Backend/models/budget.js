const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        month_year:{
            type:String,
            required:true,
        },
        amount:{
            type: Number,
            required:true,
        },
    },
    {
        timestamps:true
    }
);
// One budget per user per month
budgetSchema.index(
  { user: 1, month_year: 1 },
  { unique: true }
);
console.log("Budget indexes:", budgetSchema.indexes());
module.exports = mongoose.model("Budget",budgetSchema)