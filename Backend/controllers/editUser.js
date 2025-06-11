const User = require ('../models/user')

const updateUser = async(req,res)=>{
    console.log("updateUser request---------->",req)
    const loggedInUser = req.user;
  try{
    const user= await User.find({_id:loggedInUser._id});
    if (!user){
        res.status(400).json({error:'Invalid User'})
    }else{
        res.status(200).json({message:'Loggedin Successfully.'})
    }
  }catch(error){
        res.status(400).json({error:'Unable to find user.'})        
  }
}

module.exports={updateUser}