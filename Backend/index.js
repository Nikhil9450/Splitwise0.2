require ('dotenv').config();
const express = require("express")
const cors= require('cors');
const connectDB = require('./config/db');
const userRoute = require("./routes/userRoutes")
const staticRoute = require("./routes/staticRoute")
const adminRoutes = require("./routes/adminRoutes")
const editUserRoutes = require("./routes/editUserRoutes")
const groupRoutes = require("./routes/groupRoutes")
const {checkAuth, restrictToLoggedinUserOnly} = require("./middlewares/auth")
const {checkRole}= require("./middlewares/role")
const app = express();

connectDB();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // frontend origin
  credentials: true
}));
app.use(express.json());




app.use("/",checkAuth,staticRoute);
app.use("/user",userRoute);
app.use("/admin",checkRole,adminRoutes);
app.use("/editUser",restrictToLoggedinUserOnly,editUserRoutes);
app.use("/group",checkAuth,groupRoutes);
app.listen(process.env.PORT,()=> console.log(`Server Started at PORT ${process.env.PORT}`)) 
