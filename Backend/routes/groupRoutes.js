const express = require('express')
const {fetchGroupData,createGroup}=require('../controllers/group')
const router = express.Router();

router.post("/createGroup",createGroup);
router.post("/fetchGroupData",fetchGroupData);
module.exports= router;