require ('dotenv').config();
const express = require("express")
const cors= require('cors');
const connectDB = require('./config/db');
const userRoute = require("./routes/userRoutes")
const staticRoute = require("./routes/staticRoute")
const adminRoutes = require("./routes/adminRoutes")
const editUserRoutes = require("./routes/editUserRoutes")
const groupRoutes = require("./routes/groupRoutes")
const expenseRoutes = require("./routes/expenseRoutes")
const activityRoutes = require("./routes/activityRoutes")
const {checkAuth, restrictToLoggedinUserOnly} = require("./middlewares/auth")
const {checkRole}= require("./middlewares/role")
const app = express();

connectDB();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());



app.use("/user",userRoute);

app.use("/",checkAuth,staticRoute);
app.use("/admin",checkRole,adminRoutes);
app.use("/editUser",restrictToLoggedinUserOnly,editUserRoutes);
app.use("/group",groupRoutes);
app.use("/expense",expenseRoutes);
app.use("/activity",activityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Server Started at PORT ${PORT}`)) 
