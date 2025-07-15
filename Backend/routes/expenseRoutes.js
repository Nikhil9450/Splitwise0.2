const express = require ('express');
const  {addExpense,groupExpenses,updateExpenses,deleteExpense} = require('../controllers/expense')
const router = express.Router();

router.post("/addExpense",addExpense);
router.post("/updateExpense",updateExpenses);
router.post("/deleteExpense",deleteExpense);
router.get("/fetchGroupExpenses",groupExpenses);

module.exports = router;