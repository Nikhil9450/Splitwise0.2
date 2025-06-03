const express = require ("express");
const {handleUserSignup,googleSignIn,handleUserSignIn} = require("../controllers/user")

const router = express.Router();

router.post('/',handleUserSignup);
router.post('/UserSignIn',handleUserSignIn);
router.post('/googleAuth',googleSignIn);

module.exports = router;