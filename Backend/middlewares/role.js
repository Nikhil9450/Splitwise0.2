const jwt = require('jsonwebtoken')
require('dotenv').config();

const secretKey= process.env.JWT_SECRET
const checkRole = async(req,res,next)=>{
    // console.log("check role----->",req);
    const token=req.cookies?.token;
    if (!token) return res.status(401).json({error:"User not logged in."});
    try{
        const user = jwt.verify(token,secretKey);
        console.log("user--------->",user);
        req.role = user.role;
        if (user.role !== "admin") return res.status(401).json({error:"You are not authorized to view this page."});
        next();
    } catch (err){
        console.error('Token invalid or expired:', err.message);
        return res.status(403).json({error:"User not authenticated."});
    }
}

module.exports={
    checkRole
}