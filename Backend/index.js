require ('dotenv').config();
const express = require("express")
const cors= require('cors');
const connectDB = require('./config/db');
const userRoute = require("./routes/userRoutes")
const staticRoute = require("./routes/staticRoute")
const {checkAuth} = require("./middlewares/auth")
const app = express();

connectDB();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // frontend origin
  credentials: true
}));
app.use(express.json());




app.use("/user",userRoute);
app.use("/",checkAuth,staticRoute);

app.listen(process.env.PORT,()=> console.log(`Server Started at PORT ${process.env.PORT}`)) 
