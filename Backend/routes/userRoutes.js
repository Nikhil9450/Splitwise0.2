const express = require ("express");
const {handleUserSignup,googleSignIn,handleUserSignIn,handleUserSignout} = require("../controllers/user")
const {fetchUserById} = require("../controllers/manageUser")

const router = express.Router();

router.post('/',handleUserSignup);
router.get('/profile/:id', fetchUserById);
router.post('/UserSignIn',handleUserSignIn);
router.post('/googleAuth',googleSignIn);
router.post('/logout',handleUserSignout);

module.exports = router;