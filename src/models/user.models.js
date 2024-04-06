import { Schema,model } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: [true , 'email already exists'],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    birth: {
        type: String 
    },
    username: {
        type: String,
        unique: [true , 'username not available'],
        index: true
    },
    firstname: {
        type: String
    },
    gmailSignedUp: {
        type: Boolean,
        required: true,
        default: true
    },
    lastname: {
        type: String
    },
    avatar: {
        type: String
    },
    viewedPhoto: [{
        type: Schema.Types.ObjectId,
        ref: 'Photo'
    }],
    follower: {
        type: Number
    },
    refreshToken: {
        type: String
    }
})

userSchema.pre('save' , async function(next){
    try {
        if (!this.isModified('password')) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 10);
        console.log(this.password, " from userSchema.pre() function");
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = model('User' , userSchema);