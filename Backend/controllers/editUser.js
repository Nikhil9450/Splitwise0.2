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

const changePassword = async (req, res) => {
  const loggedInUser = req.user;

  try {
    let { currentPassword, newPassword } = req.body;

    const user = await User.findById(loggedInUser.id);
    if (!user) {
      return res.status(400).json({ error: 'Invalid User' });
    }

    let updateFields = {};

    // Check if password update is requested
    if (currentPassword !== undefined || newPassword !== undefined) {

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: 'Both current and new password are required.'
        });
      }

      if (
        currentPassword.trim() === "" ||
        newPassword.trim() === ""
      ) {
        return res.status(400).json({
          error: "Password cannot be empty"
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect current password' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      updateFields.password = hashedPassword;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      loggedInUser.id,
      updateFields,
      { new: true }
    );

    res.status(200).json({
      message: 'Password Changed Successfully.',
      updatedUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to process request.' });
  }
};

const fetchUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.log("error---->",error)
        return res.status(400).json({ error: "some error occured in fetching user" });
    }
};
module.exports={updateUser, changePassword, fetchUserById}