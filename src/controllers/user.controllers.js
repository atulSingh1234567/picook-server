import { User } from "../models/user.models.js";


export const setCookie = async (req , res)=>{
    res.cookie('name' ,  "atul singh");
    return res.send("set up cookie page");
}

const registerUser = async (req,res)=>{
    const {email ,birth, password} = req.body;
    
    // validation
    
    if(( !email || !password)){
        return res.status(400).json({
            message: 'All fields required'
        })
    }

    // checking user with email
    const existedUser = await User.findOne({email});
    if(existedUser){
        return res.status(409).json({
            message: 'Email already exists, Kindly login.'
        })
    }

    // create user
    try {
        const rgx = /^[^@]*/;
        const username = email.match(rgx)
        await User.create({
            email,
            password,
            birth,
            username:username[0]
        })

        return res.status(200).json({
            message: "Signup Completed!"
        })
    } catch (error) {
        return res.status(500).send("Error occured while registering...")
    }

}

export const editProfile = async (req , res)=>{
    try {
        const {firstname , username, lastname, avatar} = req.body.userDetails;
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    username,
                    firstname,
                    lastname,
                    avatar
                }
            },
            {
                new: true
            }
        )

        const user = await User.findById(req.user._id).select("-password -refreshToken")
    
        return res.status(200).json({message: 'Profile has been edited' , user })
    } catch (error) {
        return res.status(404).json({message: 'User not registered' });
    }
}


// *************************************************

export const fetchUser = async (req , res)=>{
    try {
       const user = await User.findById(req.user._id).select("-password -refreshToken");
       return res.status(200).send(user)
    } catch (error) {
        return res.status(404).json({
            message: "Signin first"
        })
    }
}


const generateAccessAndRefreshTokens = async function(userId){
     const user = await User.findById(userId);
     const accessToken = await user.generateAccessToken();
     const refreshToken = await user.generateRefreshToken();

     user.refreshToken = refreshToken;
     await user.save({validateBeforeSave : false})

     return {accessToken , refreshToken}
}



const loginUser = async (req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({message:"User doesn't exist, please signup first"});
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        return res.status(401).json( {message : "Invalid user credentials"});
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id);
  
    res.cookie('accessToken' , accessToken, {path: "/",
    expires: new Date(Date.now() + 1000 * 30), // 30 seconds
    httpOnly: true,
    sameSite: "lax"
  })

    const data = await User.findById(user._id).select("-password -refreshToken -gmailSignedUp")
    

    return res.status(200)
    .json({
        data,
        accessToken
    })

}


export const changePassword = async function(req ,res){
    try {
        const {password , email} = req.body.changePassword;
    
        if(!email){
            return res.status(401).json({
                message: 'Please provide email'
            })
        }
    
    
        const user = await User.findById(req.user._id);
    
        user.password = password;
        await user.save({validateBeforeSave: false});
    
        return res.status(200).json(
            {
                message: 'Password changed successfully'
            }
        )
    } catch (error) {
        return res.status(500).json(
            {
                message: 'Something went wrong'
            }
        )
    }
}



export {registerUser , loginUser}