import { Photo } from "../models/photo.models.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";

export const postPhoto = async (req , res)=>{
    try {
        const { title, description, userId } = req.body
        const localFilePath = req.file.path;
        const uploadYourPhoto = await uploadOnCloudinary(localFilePath)
        const photo = await Photo.create({
            photoURL : uploadYourPhoto.secure_url,
            title,
            description,
            owner : userId
        })
        return res.status(200).json({message: "Pin successfully created",
            photo
        })
    } catch (error) {
        return res.status(500).json({
            message: "Photo Can not be uploaded"
        })
    }
}

export const setProfilePicture = async(req,res)=>{
    try{
        const localfilepath = req.file.path;
        const userId = req.body.userId;
        const uploadYourPhoto = await uploadOnCloudinary(localfilepath);
        
        const photoURL = uploadYourPhoto.secure_url;
        await User.findByIdAndUpdate(
             userId,
             {
                $set: {
                    avatar : photoURL
                }
            },
            {
                new: true
            }
        )

       const user = await User.findById(userId).select("-password")
       return res.status(200).json({message: 'Profile photo has been edited' , user })
    }
    catch(error){
        return res.status(500).json({message: "Profile photo has been edited"})
    }
}

export const fetchPhotos = async(req,res)=>{
    try {
        const userId = req.body.userId;
        const photos = await Photo.find({owner:userId});
        return res.status(201).send(photos)
    } catch (error) {
        return res.status(500).json({message : "Something went wrong"})
    }
}

export const savePhoto = async(req,res)=>{
    const {userId,photoId} = req.body

}