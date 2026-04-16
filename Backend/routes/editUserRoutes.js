const express = require("express")
const router = express.Router();
const {updateUser,changePassword,fetchUserById}=require('../controllers/editUser')


router.post('/update',updateUser);
router.post('/change-password', changePassword);
router.get('/fetchUserDetails/:id', fetchUserById);

module.exports = router;