const express = require ('express');
const {addPersonalExpense,updatePersonalExpenses,deletePersonalExpense,fetchAllPersonalExpense,fetchExpensesByMonthYear} = require('../controllers/personalExpense')
const router = express.Router();

router.post("/addPersonalExpense",addPersonalExpense);
router.post("/updatePersonalExpense",updatePersonalExpenses);
router.post("/deletePersonalExpense",deletePersonalExpense);
router.get("/fetchAllPersonalExpense",fetchAllPersonalExpense);
router.get("/fetchExpensesByMonthYear/:month_year",fetchExpensesByMonthYear);
module.exports = router;