import { Photo } from "../models/photo.models.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";

export const postPhoto = async (req, res) => {
    try {
        const { title, description, userId } = req.body
        const localFilePath = req.file.path;
        const uploadYourPhoto = await uploadOnCloudinary(localFilePath)
        const photo = await Photo.create({
            photoURL: uploadYourPhoto.secure_url,
            title,
            description,
            owner: userId
        })
        return res.status(200).json({
            message: "Pin successfully created",
            photo
        })
    } catch (error) {
        return res.status(500).json({
            message: "Photo Can not be uploaded"
        })
    }
}

export const setProfilePicture = async (req, res) => {
    try {
        const localfilepath = req.file.path;
        const userId = req.body.userId;
        const uploadYourPhoto = await uploadOnCloudinary(localfilepath);

        const photoURL = uploadYourPhoto.secure_url;
        await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    avatar: photoURL
                }
            },
            {
                new: true
            }
        )

        const user = await User.findById(userId).select("-password")
        return res.status(200).json({ message: 'Profile photo has been edited', user })
    }
    catch (error) {
        return res.status(500).json({ message: "Profile photo has been edited" })
    }
}

export const fetchPhotos = async (req, res) => {
    try {
        const userId = req.body.userId;
        const photos = await Photo.find({ owner: userId });
        return res.status(201).send(photos)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" })
    }
}

export const savePhoto = async (req, res) => {
    try {
        const { userId, photoId } = req.body;

        if (!userId || !photoId) {
            return res.status(400).json({ message: "User ID and Photo ID are required" });
        }
        
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { viewedPhoto: photoId } }, 
            { new: true } 
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }    
        return res.status(200).json({ message: "Photo added to viewedPhoto"});

    } catch (error) {
        console.error("Error adding photo to viewedPhoto:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    

}


export const dbPhotos = async (req, res) => {
    try {
        const allPhotos = await Photo.find();
        return res.status(201).json({
            photo: allPhotos
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

export const sendSavedPhoto = async (req,res)=>{
    try {
        const {userId} = req.body;
        console.log(userId)
        const user = await User.findById(userId)
        console.log(user)
        const photos = await Promise.all(
            user.viewedPhoto.map(async (id) => {
                return await Photo.findById(id);
            })
        );

        return res.status(201).json({photos})
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
}