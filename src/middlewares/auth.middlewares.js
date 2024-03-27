import jwt from 'jsonwebtoken';
import {User} from '../models/user.models.js'
export const verifyJWT = async (req,res,next)=>{
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ' , '');

    if(!token){
        throw new Error("access token not found");
    }

    const decodedInfo = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

    const loggedInUser = await User.findById(decodedInfo?._id).select("-password -refreshToken");

    if(!loggedInUser){
        return res.status(401).json({
            message: "Invalid Access Token"
        })
    }

    req.user = loggedInUser
    next()

}