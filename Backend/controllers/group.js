const Group = require('../models/group');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const secretKey = process.env.JWT_SECRET;

const createGroup = async( req,res)=>{
    const user = req.user;
    if(!user){
        return res.status(400).json({error:"User is not authenticated"});  
    }
    const token = req.cookies?.token;
    let decodedUser;
    try {
        decodedUser = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
    const userID = decodedUser.id;
    const groupName= req.body.data.groupName;
    const groupMembers = req.body.data.groupMembers;
    console.log(req.body)
    console.log("userID,groupName,groupMembers",userID,groupName,groupMembers);
    if(!groupName || !groupMembers){
        return res.status(400).json({error:"invalid data."});
    }
    
    try{
       const createdGroup = await Group.create({
            name:groupName,
            members:groupMembers,
            createdBy:userID,
        },)
        return res.status(200).json(createdGroup);
    }catch(error){
        console.log("error-------->",error);
        return res.status(500).json({error:"internal server error"});
    }
}

const fetchGroupData = async( req,res)=>{
    const user = req.user;
    if(!user){
        return res.status(400).json({error:"User is not authenticated"});  
    }
    const token = req.cookies?.token;
    let decodedUser;
    try {
        decodedUser = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
    const userID = decodedUser.id;
    const groupId= req.body.groupId;
    console.log("userID,groupId---------->",userID,groupId)
    if(!groupId){
        return res.status(400).json({error:"group id is invalid"});
    }

    try{
        const groupDetails =await Group.findById(groupId)
        return res.status(200).json(groupDetails);
    }catch(error){
        console.log("error-------->",error);
        return res.status(500).json({error:"internal server error"});
    }
}

module.exports={fetchGroupData,createGroup}