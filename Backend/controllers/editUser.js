const User = require ('../models/user')
const updateUser = async(req,res)=>{
    console.log("updateUser request---------->",req.body)

    const loggedInUser = req.user;
        console.log("loggedInUser---------->",loggedInUser)


try {
  const user = await User.findById(loggedInUser.id);
  console.log("Fetched user:", user);

  if (!user) {
    return res.status(400).json({ error: 'Invalid User' });
  }
  const { name, email, currentPassword, newPassword } = req.body;
  console.log("Current Password from req:", currentPassword);

  if (currentPassword || newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required to set a new password.' });
    }

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required to change the password.' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    console.log("isMatch----------------->", isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    user.password = newPassword; // ✅ Will be hashed by Mongoose middleware
  }

// Update other fields
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save(); // ✅ triggers middleware

    res.status(200).json({ message: 'Updated Successfully.', updatedUser: user });

} catch (error) {
  console.error("Outer catch error:", error);
  res.status(500).json({ error: 'Unable to process request.' });
}

}

module.exports={updateUser}