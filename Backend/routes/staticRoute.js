const express = require ("express")
const router = express.Router();
const User = require('../models/user');
const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const jwt = require('jsonwebtoken');

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
// router.get("/findUser", async(req,res)=>{
//     console.log("checkAuth user-------->",req.user);
//     const user= req.user;
//     console.log("req.query-------->",req.query);
//     let decodeduser;
//     try {
//         decodeduser = jwt.verify(user, secretKey);
//     } catch (err) {
//         return res.status(401).json({ error: "Invalid or expired token." });
//     }
//     if(!user){
//         return res.status(400).json({error :"User is not authenticated."})
//     }else{
//         const emailForSearch= req.query.email;
//         try{
//           const searchedUser = await User.find({email:emailForSearch})

//           const dataToDisplay= searchedUser.map( async(user)=>{
//                 const alreadySent = await User.exists({
//                         _id: user.id,
//                         friendRequestsSent: decodeduser.id
//                         });
//                 const alreadyRecieved = await User.exists({
//                         _id:  user.id,
//                         friendRequestsReceived: decodeduser.id
//                         });                        
//             if(user.id)
//             return {
//                 name:user.name,
//                 email:user.email,
//                 id:user._id,
//                 friendRequestSent: !!alreadySent,
//                 friendRequestRecieved: !!alreadyRecieved
//             }
//           })
//           console.log('searchedUser',searchedUser)
//           return res.status(200).json(dataToDisplay)
//         }catch(error){
//           return res.status(400).json({error :'Error occured in finding user.'})
//         }
//     }
// })
router.get("/findUser", async (req, res) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(400).json({ error: "User is not authenticated." });
    }

    let decodeduser;
    try {
        decodeduser = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }

    const emailForSearch = req.query.email;

    if (!emailForSearch) {
        return res.status(400).json({ error: "Email query parameter is required." });
    }

    try {
        const user = await User.findOne({ email: emailForSearch });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Don't allow searching yourself
        if (user._id.toString() === decodeduser.id) {
            return res.status(400).json({ error: "You cannot search for yourself." });
        }

        const hasSentMeRequest = user.friendRequestsSent.includes(decodeduser.id);
        const hasReceivedMyRequest = user.friendRequestsReceived.includes(decodeduser.id);
        const alreadyFriends = user.friends.includes( decodeduser.id);

        let requestStatus;

        if (hasSentMeRequest) {
            requestStatus = "incoming";
        } else if (hasReceivedMyRequest) {
            requestStatus = "outgoing";
        } else if(alreadyFriends){
            requestStatus = "alreadyFriends";
        } else {
            requestStatus = "none";
        }

        return res.status(200).json({
            name: user.name,
            email: user.email,
            id: user._id,
            requestStatus
        });

    } catch (error) {
        console.error("Error finding user:", error);
        return res.status(500).json({ error: "Error occurred in finding user." });
    }
});

router.post("/sendFriendRequest", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "User is not authenticated." });

  let decodedUser;
  try {
    decodedUser = jwt.verify(token, secretKey);
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  const fromUserId = decodedUser.id;
  const toUserId = req.body.toUserId;

  if (!toUserId || fromUserId === toUserId)
    return res.status(400).json({ error: "Invalid or same user ID." });

  try {
    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ error: "Recipient user not found." });

    // Check status from the toUser's side
    const hasAlreadyReceived = toUser.friendRequestsReceived.includes(fromUserId);
    const hasAlreadySent = toUser.friendRequestsSent.includes(fromUserId);

    if (hasAlreadyReceived)
      return res.status(400).json({ message: "Friend request already received by user." });

    if (hasAlreadySent)
      return res.status(400).json({ message: "Friend request already sent by the user." });

    // Proceed to send
    const result = await User.bulkWrite([
      {
        updateOne: {
          filter: { _id: toUserId },
          update: { $push: { friendRequestsReceived: fromUserId } },
        },
      },
      {
        updateOne: {
          filter: { _id: fromUserId },
          update: { $push: { friendRequestsSent: toUserId } },
        },
      },
    ]);

    res.status(200).json({ message: "Friend request sent successfully.", result });
  } catch (error) {
    console.error("Send Friend Request Error:", error);
    res.status(500).json({ error: "Failed to send friend request." });
  }
});

router.post("/deleteFriendRequest", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "User is not authenticated." });

  let decodedUser;
  try {
    decodedUser = jwt.verify(token, secretKey);
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  const fromUserId = decodedUser.id;
  const toUserId = req.body.toUserId;

  if (!toUserId || fromUserId === toUserId)
    return res.status(400).json({ error: "Invalid or same user ID." });

  try {
    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ error: "Recipient user not found." });

    const hasSentRequest = toUser.friendRequestsReceived.includes(fromUserId);
    const hasReceivedRequest = toUser.friendRequestsSent.includes(fromUserId);

    if (!hasSentRequest && !hasReceivedRequest)
      return res.status(400).json({ message: "No friend request to delete." });

    const result = await User.bulkWrite([
      {
        updateOne: {
          filter: { _id: toUserId },
          update: { $pull: { friendRequestsReceived: fromUserId, friendRequestsSent: fromUserId } },
        },
      },
      {
        updateOne: {
          filter: { _id: fromUserId },
          update: { $pull: { friendRequestsReceived: toUserId, friendRequestsSent: toUserId } },
        },
      },
    ]);

    res.status(200).json({ message: "Friend request deleted successfully.", result });
  } catch (error) {
    console.error("Delete Friend Request Error:", error);
    res.status(500).json({ error: "Failed to delete friend request." });
  }
});

router.post("/acceptFriendRequest", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "User is not authenticated." });

  let decodedUser;
  try {
    decodedUser = jwt.verify(token, secretKey);
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  const fromUserId = decodedUser.id; // the receiver (current logged-in user)
  const toUserId = req.body.toUserId; // the requester (sender of the friend request)

  try {
    const user = await User.findById(fromUserId);

    // Check if already friends
    if (user.friends.includes(toUserId)) {
      return res.status(400).json({ message: "You are already friends with this user." });
    }

    const result = await User.bulkWrite([
      {
        updateOne: {
          filter: { _id: fromUserId },
          update: {
            $pull: { friendRequestsReceived: toUserId },
            $push: { friends: toUserId }
          }
        }
      },
      {
        updateOne: {
          filter: { _id: toUserId },
          update: {
            $pull: { friendRequestsSent: fromUserId },
            $push: { friends: fromUserId }
          }
        }
      }
    ]);

    return res.status(200).json({ message: "Friend request accepted successfully.", result });

  } catch (error) {
    console.error("Accept Friend Request Error:", error);
    return res.status(500).json({ error: "Failed to accept friend request." });
  }
});

router.post("/removeFriend", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "User is not authenticated." });

  let decodedUser;
  try {
    decodedUser = jwt.verify(token, secretKey);
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  const fromUserId = decodedUser.id; // the receiver (current logged-in user)
  const toUserId = req.body.toUserId; // the requester (sender of the friend request)

  try {
    const user = await User.findById(fromUserId);

    // Check if already friends
    if (!(user.friends.includes(toUserId))) {
      return res.status(400).json({ message: "You are not friend with this user." });
    }

    const result = await User.bulkWrite([
      {
        updateOne: {
          filter: { _id: fromUserId },
          update: {
            // $pull: { friendRequestsReceived: toUserId },
            $pull: { friends: toUserId }
          }
        }
      },
      {
        updateOne: {
          filter: { _id: toUserId },
          update: {
            // $pull: { friendRequestsSent: fromUserId },
            $pull: { friends: fromUserId }
          }
        }
      }
    ]);

    return res.status(200).json({ message: "Friend request accepted successfully.", result });

  } catch (error) {
    console.error("Accept Friend Request Error:", error);
    return res.status(500).json({ error: "Failed to accept friend request." });
  }
});

router.get('/friendLists',async (req,res)=>{
    const token = req.cookies?.token;
    let decodedUser;
    try {
        decodedUser = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
    const userID = decodedUser.id;;

try {
    const user = await User.findById(userID);

    if (!user) {
        console.log("User not found");
        return;
    }

    const friendRequestsReceived = await User.find({
        _id: { $in: user.friendRequestsReceived }
    }, 'name email _id'); 
    const friendRequestsSent = await User.find({
        _id: { $in: user.friendRequestsSent }
    }, 'name email _id'); 
    const friends = await User.find({
        _id: { $in: user.friends }
    }, 'name email _id'); 
    const result={
        friends,
        friendRequestsReceived,
        friendRequestsSent,
    }
    console.log("Friends,recieved, sent---->", result);
    return res.status(200).json({result });
} catch (error) {
    console.log("error----------->", error);
    res.status(500).json({"error":error})
}
})

router.get('/friends',async (req,res)=>{
    const token = req.cookies?.token;
    let decodedUser;
    try {
        decodedUser = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
    const userID = decodedUser.id;;

try {
    const user = await User.findById(userID);

    if (!user) {
        console.log("User not found");
        return;
    }

    const friends = await User.find({
        _id: { $in: user.friends }
    }, 'name email _id'); 

    console.log("Friends---->", friends);
    return res.status(200).json(friends);
} catch (error) {
    console.log("error----------->", error);
    res.status(500).json({"error":error})
}
})

module.exports= router;