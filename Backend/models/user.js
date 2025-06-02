const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'Name is required'],
            trim:true,
        },
        email:{
            type:String,
            unique:true,
            lowercase:true,
            trim:true,
            required:[true,'Email is required']
        },
        password:{
            type:String,
            required:[true,'Password is required'],
            minlength:6,
        },
        role:{
            type:String,
            enum:['user','admin'],
            default:'user'
        },
        isVerified:{
            type:Boolean,
            default:false,
        },
        
    },
    {timestamps:true},
)

const User = mongoose.model("user",userSchema);
module.exports = User;