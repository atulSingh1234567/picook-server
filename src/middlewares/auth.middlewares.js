import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js'
export const verifyJWT = async (req, res, next) => {
    const token = req.cookies?.accessToken || req.body.accessToken || req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access token not found');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedInfo) => {
        if (err && err.name === 'TokenExpiredError') {
            return res.status(403).send('Access token expired. Please refresh your token.');
        } else if (err) {
            return res.status(401).send('Invalid access token');
        } else {
            const loggedInUser = await User.findById(decodedInfo?._id).select("-password -refreshToken");
            req.user = loggedInUser
            next()
        }})

    }

