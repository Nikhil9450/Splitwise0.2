const jwt = require('jsonwebtoken');
require('dotenv').config();


const secretKey = process.env.JWT_SECRET || 'your-secret-key';
async function restrictToLoggedinUserOnly(req,res,next){
    // console.log("restrictToLoggedinUserOnly req----->",req);
    const token = req.cookies?.token;
    if (!token) return res.status(401).send("Invalid user");
    try {
        const user = jwt.verify(token, secretKey);
        console.log(user);
        console.log(" req.user before------>",req.user);
        req.user = user;
        console.log(" req.user after------>",req.user);
        next();
    } catch (err) {
        console.error('Token invalid or expired:', err.message);
        return res.status(403).send("User not authorized");
    }
}

async function checkAuth(req,res,next){
    console.log("inside check auth")
    //  const token = req.cookies?.token;
    // const decodeduser = jwt.verify(token, secretKey);
    const user = req.cookies?.token;
    console.log("user---->",user);
    req.user = user;
    next();
}

module.exports={
    restrictToLoggedinUserOnly,
    checkAuth,
}