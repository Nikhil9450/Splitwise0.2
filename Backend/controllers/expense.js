const Expense = require ("../models/expenses");
const User = require("../models/user");



const handleExpense =async(req,res)=>{
    const {description,amount,paidBy,splitBetweenWithAmt}=req.body;
    try{
        Expense.create({
            description,
            amount,
            paidBy,
            splitBetweenWithAmt,
        })
        return res.status(200).send("Expense added successfully.")
    } catch(error){
        console.log("error in handleExpense------->",error)
        res.status(400).json({ error: 'Expense addition failed.' })
    }

}

module.exports={handleExpense}