const express = require('express');
const {fetchAllUsers} = require('../controllers/manageUser')
const router = express.Router();

router.get("/fetchAllUsers",fetchAllUsers)

module.exports=router;