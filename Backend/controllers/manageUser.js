const User= require('../models/user')

const fetchAllUsers =async(req,res)=>{
    try{
        const user =await User.find();
        return res.status(200).json(user);
    }catch(error){
        console.log("error---->",error)
        return res.status(400).json({error:"some error occured in fetching users"})
    }

}

module.exports={
    fetchAllUsers
}