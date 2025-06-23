const express = require('express')
const {fetchUserGroups,createGroup}=require('../controllers/group')
const router = express.Router();

router.post("/createGroup",createGroup);
router.post("/fetchUserGroups",fetchUserGroups);
module.exports= router;