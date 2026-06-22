const express = require ('express');
const {addPersonalExpense,updatePersonalExpenses,deletePersonalExpense,fetchAllPersonalExpense} = require('../controllers/personalExpense')
const router = express.Router();

router.post("/addPersonalExpense",addPersonalExpense);
router.post("/updatePersonalExpense",updatePersonalExpenses);
router.post("/deletePersonalExpense",deletePersonalExpense);
router.get("/fetchAllPersonalExpense",fetchAllPersonalExpense);
module.exports = router;