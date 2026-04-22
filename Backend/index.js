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
const allowedOrigins = [
  "http://localhost:3000",
  "https://splitwise0-2.vercel.app",
  "https://splitwise0-2-9m9hombb8-nikhilk9450-3121s-projects.vercel.app"
];
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
