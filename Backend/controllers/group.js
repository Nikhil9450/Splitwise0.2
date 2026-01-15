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
        await User.updateMany(
            {_id:{$in:groupMembers}},
            {$addToSet:{groups:createdGroup._id}},
        )
        return res.status(200).json(createdGroup);
    }catch(error){
        console.log("error-------->",error);
        return res.status(500).json({error:"internal server error"});
    }
}

const fetchUserGroups = async( req,res)=>{
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
    // const groupId= req.body.groupId;
    // console.log("userID,groupId---------->",userID,groupId)
    // if(!groupId){
    //     return res.status(400).json({error:"group id is invalid"});
    // }

    try{
        const user = await User.findById(userID);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const userGroupList = user.groups;

        // 1. Get all group details
        const groupDetails = await Group.find(
        { _id: { $in: userGroupList } },
        '_id name members expenses createdBy createdAt'
        );

        // 2. Collect all unique member IDs from all groups
        const allMemberIds = [
        ...new Set(groupDetails.flatMap(group => group.members.map(id => id.toString())))
        ];

        // 3. Fetch all members in one query
        const members = await User.find(
        { _id: { $in: allMemberIds } },
        '_id name email' // Include only necessary fields
        );

        // 4. Create a map of memberId -> member object for quick access
        const memberMap = new Map();
        members.forEach(member => {
        memberMap.set(member._id.toString(), member);
        });

        // 5. Combine details
        const combinedGroupDetails = groupDetails.map(group => ({
        id: group._id,
        name: group.name,
        members: group.members.map(memberId => memberMap.get(memberId.toString())),
        expenses: group.expenses,
        createdBy: group.createdBy,
        createdAt: group.createdAt
        }));

        return res.status(200).json(combinedGroupDetails);

    }catch(error){
        console.log("error-------->",error);
        return res.status(500).json({error:"internal server error"});
    }
}

const fetchGroupById = async(req,res)=>{
    const loginuser = req.user;
    const groupId = req.query.groupId;
    console.log("groupId------>",groupId)
    if(!loginuser){
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

    try{
        const user = await User.findById(userID);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const groupDetail = await Group.findById(groupId)

        return res.status(200).json(groupDetail);

    }catch(error){
        console.log("error-------->",error);
        return res.status(500).json({error:"internal server error"});
    }    
}
module.exports={fetchUserGroups,createGroup, fetchGroupById}