const express = require ("express")
const router = express.Router();
const User = require('../models/user');
router.get("/checkAuth",async function(req,res){
    console.log("checkAuth user-------->",req.user);
    const user= req.user;
    if(!user){
        return res.status(200).json({isAuthenticated :false})
    }else{
        console.log(user)
        return res.status(200).json({isAuthenticated :true,role:user.role,user})
    }
})
router.get("/findUser", async(req,res)=>{
    console.log("checkAuth user-------->",req.user);
    const user= req.user;
    console.log("req.query-------->",req.query);
   
    if(!user){
        return res.status(400).json({error :"User is not authenticated."})
    }else{
        const emailForSearch= req.query.email;
        try{
          const searchedUser = await User.find({email:emailForSearch})
          const dataToDisplay= searchedUser.map((user)=>{
            return {
                name:user.name,
                email:user.email,
                id:user._id
            }
          })
          console.log('searchedUser',searchedUser)
          return res.status(200).json({user :dataToDisplay})
        }catch(error){
          return res.status(400).json({error :'Error occured in finding user.'})
        }
    }

})

module.exports= router;