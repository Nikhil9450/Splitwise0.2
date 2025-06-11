const express = require("express")
const router = express.Router();
const {updateUser}=require('../controllers/editUser')


router.post('/update',updateUser);

module.exports = router;