import { User } from "../models/user.models.js";

const registerUser = async (req,res)=>{
    const {email ,gmailSignedUp, birth, password,googleName} = req.body;
    console.log(email, password, birth)
    // validation
    if( !gmailSignedUp &&( !email || !password)){
        throw new Error("All fields required")
    }

    // checking user with email
    const existedUser = await User.findOne({email});
    if(existedUser){
        throw new Error("User already exists")
    }

    // create user
    try {
        const user = await User.create({
            email,
            password,
            googleName,
            gmailSignedUp,
            birth
        })
        
        const createdUser = await User.findById(user._id).select("-password -refreshToken -gmailSignedUp")
        if(!createdUser){
            return res.status(500).send('Something went wrong while signing up')
        }

        return res.status(200).send(createdUser)
    } catch (error) {
        res.status(500).send("Error occured while registering...")
        console.log(error)
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
        throw new Error("User doesn't exist, please signup first");
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new Error("Invalid user credentials");
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -gmailSignedUp")

    const options = {
        httpOnly : true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken",refreshToken,options)
    .json({
        loggedInUser,
        accessToken,
        refreshToken
    })
}


const logout = async (req, res)=>{
     await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
     )

     const options = {
        httpOnly : true,
        secure: true
    }


    return res.status(200).clearCookie("accessToken" , options).clearCookie("refreshToken" , options).json({
        message: "user loggedout successfully"
    });
}

export {registerUser , loginUser , logout}