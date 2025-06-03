const express= require("express");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");
const staticRoute = require("./routes/staticRouter");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {restrictToLoggedinUserOnly,checkAuth}=require('./middlewares/auth')

const {connectToMongoDB} = require ("./connect");
const URL = require("./models/url")
const app = express()
const PORT = 3000;
connectToMongoDB('mongodb://localhost:27017/short-url').then(()=>console.log('mongodb connected'))
app.use(cors({
  origin: 'http://localhost:3001', // frontend origin
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/url",restrictToLoggedinUserOnly,urlRoute);
app.use("/user",userRoute);
app.use("/",checkAuth,staticRoute)


app.get("/:shortId",async(req,res)=>{

    const shortId= req.params.shortId;
    console.log("shortId---------->",shortId)
    const entry = await URL.findOneAndUpdate(
    {
        shortId
    },
    {
        $push : {
            visitHistory:{
                timestamp : Date.now()
            }
        }
    },
    {
      returnOriginal: false // <-- for Mongoose (or returnDocument: "after" for native Mongo)
    }
);
  if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }
    console.log("entry--------->",entry)
    res.redirect(entry.redirectURL);
})

app.listen(PORT,()=> console.log(`Server Started at PORT ${PORT}`)) 

