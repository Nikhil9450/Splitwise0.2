const express = require ('express');
const  {addExpense,groupExpenses,updateExpenses} = require('../controllers/expense')
const router = express.Router();

router.post("/addExpense",addExpense);
router.post("/updateExpense",updateExpenses);
router.get("/fetchGroupExpenses",groupExpenses);

module.exports = router;