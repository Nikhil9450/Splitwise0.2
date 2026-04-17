const express = require("express")
const router = express.Router();
const {updateUser,changePassword}=require('../controllers/editUser')


router.post('/update',updateUser);
router.post('/change-password', changePassword);

module.exports = router;