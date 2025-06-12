const User = require ('../models/user')
const bcrypt = require('bcrypt');

const updateUser = async (req, res) => {
  console.log("updateUser request---------->", req.body);

  const loggedInUser = req.user;
  console.log("loggedInUser---------->", loggedInUser);

  try {
    const { name, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(loggedInUser.id);
    if (!user) {
      return res.status(400).json({ error: 'Invalid User' });
    }

    let updateFields = {
      name: name || user.name,
      email: email || user.email,
    };

    // Handle password update
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current and new password are required.' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect current password' });
      }

      // ✅ Manually hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      updateFields.password = hashedPassword;
    }

    // ✅ Use findOneAndUpdate with hashed password if applicable
    const updatedUser = await User.findOneAndUpdate(
      { _id: loggedInUser.id },
      updateFields,
      { new: true } // return the updated document
    );

    res.status(200).json({ message: 'Updated Successfully.', updatedUser });

  } catch (error) {
    console.error("Outer catch error:", error);
    res.status(500).json({ error: 'Unable to process request.' });
  }
};

module.exports={updateUser}