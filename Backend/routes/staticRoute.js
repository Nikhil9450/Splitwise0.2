const express = require ("express")
const router = express.Router();

router.get("/checkAuth",async function(req,res){
    console.log("checkAuth user-------->",req.user);
    const user= req.user;
    if(!user){
        return res.status(200).json({isAuthenticated :false})
    }else{
        console.log(user)
        return res.status(200).json({isAuthenticated :true})
    }
})

module.exports= router;