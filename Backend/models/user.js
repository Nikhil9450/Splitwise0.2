const mongoose = require ("mongoose");
const bcrypt = require('bcrypt');

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
            required:[true,'Email is required'],
            index: true,
        },
        password:{
            type:String,
            minlength:6,
        },
        googleId: {
            type: String,
            default: null,
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
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
        groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }]
    },
    {timestamps:true},
)

    // 🔒 Hash password before saving
    userSchema.pre('save', async function (next) {
    if (!this.password || !this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    });

    // 🔑 Compare password for login
    userSchema.methods.comparePassword = async function (candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    };

module.exports = mongoose.model("User",userSchema);