const PersonalExpense = require ("../models/personalExpense");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your-secret-key';


const addPersonalExpense =async(req,res)=>{
    const user = req.user;
    if(!user){
        return res.status(400).json({error:"User is not authenticated"});  
    }
    const token = req.cookies?.token;
    let decodedUser;
    try {
        decodedUser = jwt.verify(token, secretKey);
        console.log("user id -------------->",decodedUser);

    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
    let {description,amount,date}=req.body.data;
    console.log( "req.body.data-------->",req.body.data)

    try{
       await PersonalExpense.create({
            user: decodedUser.id,
            description,
            amount,
            date,
        })
        return res.status(200).json("Expense added successfully.")
    } catch(error){
        console.log("error in handleExpense------->",error)
        res.status(400).json({ error: 'Expense addition failed.' })
    }

}

const updatePersonalExpenses = async(req,res)=>{
    const user = req.user;
    if(!user){
        return res.status(400).json({error:"User is not authenticated"});  
    }
    const token = req.cookies?.token;
    let decodedUser;
    try {
        decodedUser = jwt.verify(token, secretKey);
        console.log("user id -------------->",decodedUser);

    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
    let {description,amount,date,expenseId}=req.body.data;
    console.log( "req.body.data-------->",req.body.data)
    const updatedData = {
            description,
            amount,
            date,
        };

    try{
        await PersonalExpense.findByIdAndUpdate(
            expenseId,
            updatedData,
            // { new: true, runValidators: true }
            );
        return res.status(200).json("Expense updated successfully.")    
    }catch(err){
        console.log("error in EditExpense------->",err)
        res.status(400).json({ error: 'Expense update failed.' })
    }
}

const deletePersonalExpense = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "User is not authenticated." });
    }

    console.log("expenseId in deletePersonalExpense------->", req.body);
    const  expenseId  = req.body.expenseId;
    if (!expenseId) {
        return res.status(400).json({ error: "Expense ID is required." });
    }

    try {
        const deletedExpense = await PersonalExpense.findByIdAndDelete(expenseId);

        if (!deletedExpense) {
            return res.status(404).json({ error: "Expense not found." });
        }

        return res.status(200).json({ message: "Expense deleted successfully." });
    } catch (err) {
        console.error("Error in deletePersonalExpense ----->", err);
        return res.status(500).json({ error: "Internal server error during expense deletion." });
    }
};

const fetchAllPersonalExpense=async(req,res)=>{
    const user = req.user;
    if(!user){
        return res.status(400).json({error: "User is not authenticated"});
    }
    const token = req.cookies?.token;
    let decodedUser;
    try{
        decodedUser = jwt.verify(token,secretKey);
    } catch (err){
        return res.status(401).json({error:"Invalid or expired token." })
    }

    try{
        const ExpenseDetails = await PersonalExpense.find({ user: decodedUser.id });
        console.log(
            JSON.stringify(ExpenseDetails, null, 2)
        );
        return res.status(200).json(ExpenseDetails);
    }catch(error){
        console.log("error----------->", error);
        return res.status(500).json({"error":error})
    }
}

const fetchExpensesByMonthYear = async (req, res) => {
    console.log("req.params in fetchExpensesByMonthYear------->", req.params);
    const user = req.user;

    if (!user) {
        return res.status(400).json({ error: "User is not authenticated" });
    }

    const { month_year } = req.params; // Example: "06-2026"

    try {
        const [month, year] = month_year.split("-");

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const expenses = await PersonalExpense.find({
            user: user.id,
            date: {
                $gte: startDate,
                $lt: endDate,
            },
        }).sort({ date: -1 });
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        console.log("req.user in fetchExpensesByMonthYear------->", req.user);
        console.log("expenses in fetchExpensesByMonthYear------->", expenses);
        console.log("total in fetchExpensesByMonthYear------->", total);
        return res.status(200).json({ expenses, total });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addPersonalExpense,
    updatePersonalExpenses,
    deletePersonalExpense,
    fetchAllPersonalExpense,
    fetchExpensesByMonthYear
}