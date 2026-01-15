const express = require('express')
const {fetchUserGroups,createGroup,fetchGroupById}=require('../controllers/group')
const router = express.Router();

router.post("/createGroup",createGroup);
router.post("/fetchUserGroups",fetchUserGroups);
router.get("/fetchGroupById",fetchGroupById)
module.exports= router;