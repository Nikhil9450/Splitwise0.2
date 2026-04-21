const express = require('express')
const {fetchUserGroups,createGroup,fetchGroupById,deleteGroup}=require('../controllers/group')
const router = express.Router();

router.post("/createGroup",createGroup);
router.post("/fetchUserGroups",fetchUserGroups);
router.get("/fetchGroupById",fetchGroupById);
router.delete("/deleteGroup/:groupId",deleteGroup);
module.exports= router;