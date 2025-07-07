const Expense = require ("../models/expenses");
const User = require("../models/user");
const Group = require("../models/group")
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
    let {description,amount,paidBy,splitBetweenWithAmt,group,addedBy,date}=req.body.data;
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
            date,
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
        const expenses = await Expense.find({group:groupId});
        const grp =await Group.findById(groupId);
        console.log("grp------>",grp);
        const grp_members = grp.members;
        const grp_members_with_name = await User.find({_id:{$in:grp_members}},'_id name');
        const id_name_mapping = grp_members_with_name.reduce((acc,user)=>{
            acc[user._id]=user.name;
            return acc;
        },{})
        // const paid_by_id = expenses.map((expense)=> expense.paidBy);
            const modified_exp = expenses.map((expense) => {
            const expObj = expense.toObject();

            // Replace paidBy with { _id, name }
            const paidById = expense.paidBy.toString();
            expObj.paidBy = {
                _id: paidById,
                name: id_name_mapping[paidById],
            };

            // Replace addedBy with { _id, name }
            const addedById = expense.addedBy.toString();
            expObj.addedBy = {
                _id: addedById,
                name: id_name_mapping[addedById],
            };

            // Replace splitBetweenWithAmt items
            expObj.splitBetweenWithAmt = expObj.splitBetweenWithAmt.map((item) => {
                const userId = item.user.toString();
                const owesToId = item.owesTo.toString();

                return {
                ...item,
                user: {
                    _id: userId,
                    name: id_name_mapping[userId],
                },
                owesTo: {
                    _id: owesToId,
                    name: id_name_mapping[owesToId],
                },
                };
            });

            return expObj;
            });
        console.log("modified_exp----------->",modified_exp);
        // console.log("paid_by----------->",paid_by);
        return res.status(200).json(modified_exp);        
    } catch (error) {
        console.log("error----------->", error);
        return res.status(500).json({"error":error})
        
    }
}
module.exports={addExpense,groupExpenses}