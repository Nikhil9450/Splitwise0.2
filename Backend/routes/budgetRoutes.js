const express = require ('express');
const {addBudget,updateBudget,deleteBudget,fetchAllBudgets} = require('../controllers/budget')
const router = express.Router();

router.post("/addBudget",addBudget);
router.post("/updateBudget",updateBudget);
router.post("/deleteBudget",deleteBudget);
router.get("/fetchAllBudgets",fetchAllBudgets);
module.exports = router;