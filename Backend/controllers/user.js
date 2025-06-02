const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const secretKey = process.env.JWT_SECRET;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const handleUserSignup = async(req,res) =>{
    const {name,email,password}=req.body;
    try{
        User.create({
            name,
            email,
            password
        })
        return res.status(200).send("user created");
    } catch(error){
        console.log("error----->",error);
    }
}

const googleSignIn = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // create new user
      user = await User.create({
        name,
        email,
        googleId,
        isVerified: true,
      });
    }

    // Create your own JWT token
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ token: authToken, user });
  } catch (error) {
    console.error("Google sign-in error:", error);
    res.status(400).json({ error: 'Google authentication failed' });
  }
};

// use react-google-login in frontend

module.exports = {
    handleUserSignup,
    googleSignIn
}