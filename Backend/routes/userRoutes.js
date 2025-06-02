const express = require ("express");
const {handleUserSignup,googleSignIn} = require("../controllers/user")

const router = express.Router();

router.post('/',handleUserSignup);
router.post('/googleAuth',googleSignIn);

module.exports = router;