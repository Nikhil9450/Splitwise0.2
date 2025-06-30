const Expense = require ("../models/expenses");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your-secret-key';


const addExpense =async(req,res)=>{
    const user = req.user;
    if(!user){
        return res.status(400).json({error:"User is not authenticated"});  
    }
    const token = req.cookies?.token;
    let decodedUser;
    try {
        decodedUser = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
    let {description,amount,paidBy,splitBetweenWithAmt,group,addedBy}=req.body.data;
    console.log( "req.body.data-------->",req.body.data)
    if (!Array.isArray(splitBetweenWithAmt)) {
        splitBetweenWithAmt = Object.values(splitBetweenWithAmt).map((item) => ({
        user: item.userId,
        owesTo: item.owesTo,
        amount: item.amount,
        }));
    }
    try{
       await Expense.create({
            description,
            amount,
            paidBy,
            addedBy,
            group,
            splitBetweenWithAmt,
        })
        return res.status(200).json("Expense added successfully.")
    } catch(error){
        console.log("error in handleExpense------->",error)
        res.status(400).json({ error: 'Expense addition failed.' })
    }

}
const groupExpenses=async(req,res)=>{
    const user = req.user;
    const groupId = req.query.groupId;
    if(!user){
        return res.status(400).json({error:"User is not authenticated"});  
    }
    const token = req.cookies?.token;
    let decodedUser;
    try {
        decodedUser = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
    try {
        const expenses = await Expense.find({group:groupId})
        return res.status(200).json(expenses);        
    } catch (error) {
        console.log("error----------->", error);
        return res.status(500).json({"error":error})
        
    }
}
module.exports={addExpense,groupExpenses}