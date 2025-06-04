const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const secretKey = process.env.JWT_SECRET;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const handleUserSignup = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Password strength validation (example: at least 6 characters)
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    // Create user
    await User.create({
      name,
      email,
      password, // Consider hashing before saving (see below)
    });

    return res.status(200).json({ success: 'User created successfully.' });

  } catch (error) {
    console.error("User creation error:", error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};


const handleUserSignIn = async (req,res)=>{
  const {email,password}= req.body;
  console.log("signIn body------>",req.body)
  try{
    const user =await User.findOne({email})
    if(!user) {
      return res.send({message:'Invalid User', loggedIn:false})
    }else{
        const isMatch = await user.comparePassword(password)
        if(isMatch){
          const payload ={
            id:user._id,
            name:user.name,
            email:user.email,
          };
          const token = jwt.sign(payload,secretKey);
          console.log("token --------->",token);
          res.cookie("token",token,{
            httpOnly:false,
            sameSite:'Lax',
            secure:false
          })
          return res.status(200).json({
            message:'Logged In Successfully.',
            loggedIn:true
          })
        }else{
          return res.status(401).json({message:"Invalid User"})
        }

    }
  }catch(error){
    console.log("error in sign in------>",error);
    return res.status(400).json({message:"Failed to login"});
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
    res.cookie("token", authToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).json({
      message: "Google Sign-in Successful",
      loggedIn: true,
      user,
    });
    // res.status(200).json({ token: authToken, user });
  } catch (error) {
    console.error("Google sign-in error:", error);
    res.status(400).json({ error: 'Google authentication failed' });
  }
};

const handleUserSignout =(req,res)=>{
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax", // or "strict"
    });
    res.status(200).json({             
      message:'Logged Out Successfully.',
      loggedIn:false
    });
}

// use react-google-login in frontend

module.exports = {
    handleUserSignup,
    googleSignIn,
    handleUserSignIn,
    handleUserSignout
}