const express = require ('express');
const  {addExpense,groupExpenses} = require('../controllers/expense')
const router = express.Router();

router.post("/addExpense",addExpense);
router.get("/fetchGroupExpenses",groupExpenses);

module.exports = router;