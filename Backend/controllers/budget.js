const Budget = require ("../models/budget");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your-secret-key';


const addBudget =async(req,res)=>{
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
    let {amount,month_year}=req.body.data;
    console.log( "req.body.data-------->",req.body.data)

    try{
       await Budget.create({
            user: decodedUser.id,
            amount,
            month_year,
        })
        return res.status(200).json("Budget added successfully.")
    } catch(error){
        console.log("error in handleBudget------->",error)
        res.status(400).json({ error: 'Budget addition failed.' })
    }

}

const updateBudget = async(req,res)=>{
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
    let {amount,month_year,budgetId}=req.body.data;
    console.log( "req.body.data-------->",req.body.data)
    const updatedData = {
            amount,
            month_year,
        };

    try{
        await Budget.findByIdAndUpdate(
            budgetId,
            updatedData,
            // { new: true, runValidators: true }
            );
        return res.status(200).json("Budget updated successfully.")    
    }catch(err){
        console.log("error in EditBudget------->",err)
        res.status(400).json({ error: 'Budget update failed.' })
    }
}

const deleteBudget = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "User is not authenticated." });
    }

    console.log("budgetId in deleteBudget------->", req.body);
    const { budgetId } = req.body.payload;
    if (!budgetId) {
        return res.status(400).json({ error: "Budget ID is required." });
    }

    try {
        const deletedBudget = await Budget.findByIdAndDelete(budgetId);

        if (!deletedBudget) {
            return res.status(404).json({ error: "Budget not found." });
        }

        return res.status(200).json({ message: "Budget deleted successfully." });
    } catch (err) {
        console.error("Error in deleteBudget ----->", err);
        return res.status(500).json({ error: "Internal server error during budget deletion." });
    }
};

const fetchAllBudgets=async(req,res)=>{
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
        const BudgetDetails = await Budget.find({ user: decodedUser.id });
        console.log(
            JSON.stringify(BudgetDetails, null, 2)
        );
        return res.status(200).json(BudgetDetails);
    }catch(error){
        console.log("error----------->", error);
        return res.status(500).json({"error":error})
    }
}

module.exports = {
    addBudget,
    updateBudget,
    deleteBudget,
    fetchAllBudgets
}